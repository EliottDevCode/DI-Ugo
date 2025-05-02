<?php

namespace App\Command;

use App\Entity\Customer;
use App\Entity\Order;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsCommand(
    name: 'ugo:orders:import',
    description: 'Import data from csv files',
)]
class UgoOrdersImportCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ParameterBagInterface $parameterBag,
        ?string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $projectDir = $this->parameterBag->get('kernel.project_dir');

        // Import customers
        $customersFile = $projectDir.'/csv/customers.csv';
        if (!file_exists($customersFile)) {
            $io->error('Le fichier customers.csv n\'existe pas');

            return Command::FAILURE;
        }

        $handle = fopen($customersFile, 'r');
        if (!$handle) {
            $io->error('Impossible d\'ouvrir le fichier customers.csv');

            return Command::FAILURE;
        }

        // Skip header
        fgetcsv($handle, 0, ';');

        $customers = [];
        while (($data = fgetcsv($handle, 0, ';')) !== false) {
            $customer = new Customer();
            // Mapping for civility
            $title = match ($data[1]) {
                '1' => 'Mme',
                '2' => 'M',
                default => null,
            };
            $customer->setTitle($title);
            $customer->setLastname($data[2]);
            $customer->setFirstname($data[3]);
            $customer->setPostalCode($data[4] ? (int) $data[4] : null);
            $customer->setCity($data[5]);
            $customer->setEmail($data[6]);

            $this->entityManager->persist($customer);
            $customers[$data[0]] = $customer;
        }
        fclose($handle);

        // Import orders
        $ordersFile = $projectDir.'/csv/purchases.csv';
        if (!file_exists($ordersFile)) {
            $io->error('Le fichier purchases.csv n\'existe pas');

            return Command::FAILURE;
        }

        $handle = fopen($ordersFile, 'r');
        if (!$handle) {
            $io->error('Impossible d\'ouvrir le fichier purchases.csv');

            return Command::FAILURE;
        }

        // Skip header
        fgetcsv($handle, 0, ';');

        while (($data = fgetcsv($handle, 0, ';')) !== false) {
            if (!isset($customers[$data[1]])) {
                $io->warning(sprintf('Client non trouvé pour la commande %s', $data[0]));
                continue;
            }

            $order = new Order();
            $order->setProduct($data[2]);
            $order->setQuantity((int) $data[3]);
            $order->setPrice((float) $data[4]);
            $order->setCurrency($data[5]);
            $order->setDate(new \DateTimeImmutable($data[6]));
            $order->setCustomer($customers[$data[1]]);

            $this->entityManager->persist($order);
        }
        fclose($handle);

        $this->entityManager->flush();

        $io->success('Import terminé avec succès');

        return Command::SUCCESS;
    }
}
