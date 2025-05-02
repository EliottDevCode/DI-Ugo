<?php

namespace App\Controller;

use App\Entity\Order;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/orders')]
class OrderController extends AbstractController
{
    public function __construct(
        private OrderRepository $orderRepository,
        private EntityManagerInterface $entityManager,
        private SerializerInterface $serializer,
        private ValidatorInterface $validator,
    ) {
    }

    #[Route('', name: 'order_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $orders = $this->orderRepository->findAll();

        return $this->json($orders, Response::HTTP_OK, [], ['groups' => ['order:read']]);
    }

    #[Route('/{id}', name: 'order_show', methods: ['GET'])]
    public function show(Order $order): JsonResponse
    {
        return $this->json($order, Response::HTTP_OK, [], ['groups' => ['order:read']]);
    }

    #[Route('', name: 'order_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $order = $this->serializer->deserialize($request->getContent(), Order::class, 'json');

        $errors = $this->validator->validate($order);
        if (count($errors) > 0) {
            return $this->json($errors, Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($order);
        $this->entityManager->flush();

        return $this->json($order, Response::HTTP_CREATED, [], ['groups' => ['order:read']]);
    }

    #[Route('/{id}', name: 'order_update', methods: ['PUT'])]
    public function update(Request $request, Order $order): JsonResponse
    {
        $this->serializer->deserialize(
            $request->getContent(),
            Order::class,
            'json',
            ['object_to_populate' => $order]
        );

        $errors = $this->validator->validate($order);
        if (count($errors) > 0) {
            return $this->json($errors, Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($order, Response::HTTP_OK, [], ['groups' => ['order:read']]);
    }

    #[Route('/{id}', name: 'order_delete', methods: ['DELETE'])]
    public function delete(Order $order): JsonResponse
    {
        $this->entityManager->remove($order);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
