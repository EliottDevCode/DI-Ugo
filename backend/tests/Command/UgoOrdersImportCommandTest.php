<?php

namespace App\Tests\Command;

use App\Command\UgoOrdersImportCommand;
use App\Entity\Customer;
use App\Entity\Order;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Console\Tester\CommandTester;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class UgoOrdersImportCommandTest extends TestCase
{
    private EntityManagerInterface|MockObject $entityManager;
    private ParameterBagInterface|MockObject $parameterBag;
    private UgoOrdersImportCommand $command;
    private string $projectDir;

    protected function setUp(): void
    {
        $this->entityManager = $this->createMock(EntityManagerInterface::class);
        $this->parameterBag = $this->createMock(ParameterBagInterface::class);
        $this->command = new UgoOrdersImportCommand(
            $this->entityManager,
            $this->parameterBag
        );
        
        // Create a temporary directory for test files
        $this->projectDir = sys_get_temp_dir() . '/ugo_test_' . uniqid();
        mkdir($this->projectDir);
        mkdir($this->projectDir . '/csv');
        
        // Simulate the parameterBag to return our test directory
        $this->parameterBag->method('get')
            ->with('kernel.project_dir')
            ->willReturn($this->projectDir);
    }

    protected function tearDown(): void
    {
        // Cleaning up test files
        if (file_exists($this->projectDir . '/csv/customers.csv')) {
            unlink($this->projectDir . '/csv/customers.csv');
        }
        if (file_exists($this->projectDir . '/csv/purchases.csv')) {
            unlink($this->projectDir . '/csv/purchases.csv');
        }
        if (is_dir($this->projectDir . '/csv')) {
            rmdir($this->projectDir . '/csv');
        }
        if (is_dir($this->projectDir)) {
            rmdir($this->projectDir);
        }
    }

    /**
     * Test if the import is successful
     */
    public function testSuccess(): void
    {
        // Create the files needed for the test
        file_put_contents(
            $this->projectDir . '/csv/customers.csv',
            "id;civility;lastname;firstname;postalcode;city;email\n" .
            "1;1;Dupont;Marie;75001;Paris;marie.dupont@example.com\n" .
            "2;2;Martin;Jean;69001;Lyon;jean.martin@example.com"
        );
        
        file_put_contents(
            $this->projectDir . '/csv/purchases.csv',
            "id;customer_id;product;quantity;price;currency;date\n" .
            "1;1;Produit A;2;19.99;EUR;2023-01-15\n" .
            "2;2;Produit B;1;29.99;EUR;2023-01-20\n" .
            "3;3;Produit C;3;9.99;EUR;2023-01-25"  
        );
        
        // Check that the EntityManager->persist() is called the right number of times
        $this->entityManager->expects($this->exactly(4))  
            ->method('persist');
        
        // Check that the EntityManager->flush() is called once
        $this->entityManager->expects($this->once())
            ->method('flush');
        
        $commandTester = new CommandTester($this->command);
        $result = $commandTester->execute([]);
        
        $this->assertEquals(0, $result);
        $this->assertStringContainsString('Import terminé avec succès', $commandTester->getDisplay());
        $this->assertStringContainsString('Client non trouvé pour la commande 3', $commandTester->getDisplay());
    }

    /**
     * Test the mapping between the CSV and the entities
     */
    public function testMapping(): void
    {
        // Create the files needed for the test
        file_put_contents(
            $this->projectDir . '/csv/customers.csv',
            "id;civility;lastname;firstname;postalcode;city;email\n" .
            "1;1;Dupont;Marie;75001;Paris;marie.dupont@example.com"
        );
        
        file_put_contents(
            $this->projectDir . '/csv/purchases.csv',
            "id;customer_id;product;quantity;price;currency;date\n" .
            "1;1;Produit A;2;19.99;EUR;2023-01-15"
        );
        
        //  Creating entities 
        $customer = new Customer();
        $order = new Order();
        
        //  Use a predictable persistence implementation
        $this->entityManager->method('persist')
            ->willReturnCallback(function ($entity) use (&$customer, &$order) {
                if ($entity instanceof Customer) {
                    // Copy the properties of the persisted entity
                    $customer->setTitle($entity->getTitle());
                    $customer->setLastname($entity->getLastname());
                    $customer->setFirstname($entity->getFirstname());
                    $customer->setPostalCode($entity->getPostalCode());
                    $customer->setCity($entity->getCity());
                    $customer->setEmail($entity->getEmail());
                } elseif ($entity instanceof Order) {
                    // Copy the properties of the persisted entity
                    $order->setProduct($entity->getProduct());
                    $order->setQuantity($entity->getQuantity());
                    $order->setPrice($entity->getPrice());
                    $order->setCurrency($entity->getCurrency());
                    $order->setDate($entity->getDate());
                    $order->setCustomer($entity->getCustomer());
                }
            });
        
        $commandTester = new CommandTester($this->command);
        $commandTester->execute([]);
        
        // Check that the Customer is created
        $this->assertEquals('Mme', $customer->getTitle());
        $this->assertEquals('Dupont', $customer->getLastname());
        $this->assertEquals('Marie', $customer->getFirstname());
        $this->assertEquals(75001, $customer->getPostalCode());
        $this->assertEquals('Paris', $customer->getCity());
        $this->assertEquals('marie.dupont@example.com', $customer->getEmail());
        
        // Check that the Order has been created 
        $this->assertEquals('Produit A', $order->getProduct());
        $this->assertEquals(2, $order->getQuantity());
        $this->assertEquals(19.99, $order->getPrice());
        $this->assertEquals('EUR', $order->getCurrency());
        
        $date = $order->getDate();
        $this->assertNotNull($date);
        $this->assertEquals('2023-01-15', $date->format('Y-m-d'));
        
        $orderCustomer = $order->getCustomer();
        $this->assertNotNull($orderCustomer);
        // Check that the customer has the same properties
        $this->assertEquals($customer->getLastname(), $orderCustomer->getLastname());
        $this->assertEquals($customer->getFirstname(), $orderCustomer->getFirstname());
    }
} 