'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

import { env } from 'node:process';

const createOrderSchema = z.object({
  customerId: z
    .number({
      invalid_type_error: 'Cliente ID deve ser numérico',
    })
    .min(1, 'Cliente ID deve ser maior que 0'),
  item: z.string().nonempty('Item é obrigatório'),
  quantity: z
    .number({
      invalid_type_error: 'Quantidade deve ser numérica',
    })
    .min(1, 'Quantidade deve ser maior que 0'),
});

type CreateOrderInput = z.infer<typeof createOrderSchema>;

export default function JsonRpcUI() {
  const [getResponse, setGetResponse] = useState<any | null>(null);
  const [listResponse, setListResponse] = useState<any[] | null>(null);
  const [showFullResponse, setShowFullResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerId: 1,
      item: '',
      quantity: 1,
    },
  });

  const sendRequest = async (
    method: string,
    params: any,
    callback?: (data: any) => void,
  ) => {
    try {
      const res = await fetch('http://localhost:5186/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      });
      const data = await res.json();
      if (callback) {
        callback(data);
      }
      return data;
    } catch (error) {
      console.error(error);
      if (callback) {
        callback({
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
      return null;
    }
  };

  const onSubmitCreateOrder = async (data: CreateOrderInput) => {
    const res = await sendRequest('createOrder', data);
    if (res && !res.error) {
      toast.success('Pedido criado com sucesso');
      form.reset();
    } else {
      toast.error(`Erro ao criar pedido: ${res?.error || 'Erro desconhecido'}`);
    }
  };

  const handleGetOrder = () => {
    const orderIdInput = document.getElementById(
      'orderIdInput',
    ) as HTMLInputElement;
    const orderId = Number(orderIdInput?.value);

    if (!orderId || orderId <= 0) {
      toast.error('ID do Pedido deve ser maior que 0');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      await sendRequest('getOrder', { id: orderId }, (data) =>
        setGetResponse(data),
      );
      setLoading(false);
    }, 1500);
  };

  const handleListOrders = () => {
    setLoadingList(true);
    setTimeout(async () => {
      await sendRequest('listOrders', {}, (data) =>
        setListResponse(data.result),
      );
      setLoadingList(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">JSON-RPC Order Service</h2>
          <p className="text-gray-600">
            Este serviço permite criar, consultar e listar pedidos utilizando
            JSON-RPC.
          </p>
        </div>
      </Card>

      {/* Criar Pedido */}
      <Card>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Criar Pedido</h3>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitCreateOrder)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente ID</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Criar Pedido</Button>
            </form>
          </Form>
        </div>
      </Card>

      {/* Consultar Pedido */}
      <Card>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Consultar Pedido</h3>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="ID do Pedido"
                id="orderIdInput"
                className="w-full"
              />
              <Button onClick={handleGetOrder}>Consultar Pedido</Button>
            </div>
            {loading ? (
              <Card>
                <div className="p-6 space-y-4">
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="rounded-xl w-full h-6" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              getResponse && (
                <Card>
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-semibold">
                      Detalhes do Pedido
                    </h3>
                    <p>
                      <strong>ID do Cliente:</strong>{' '}
                      {getResponse.result.customerId}
                    </p>
                    <p>
                      <strong>Item:</strong> {getResponse.result.item}
                    </p>
                    <p>
                      <strong>Quantidade:</strong> {getResponse.result.quantity}
                    </p>
                    <Button
                      onClick={() => setShowFullResponse(!showFullResponse)}
                    >
                      {showFullResponse
                        ? 'Esconder Resposta JSON'
                        : 'Mostrar Resposta JSON'}
                    </Button>
                    {showFullResponse && (
                      <pre className="bg-gray-900 text-white p-4 rounded-md overflow-auto">
                        {JSON.stringify(getResponse, null, 2)}
                      </pre>
                    )}
                  </div>
                </Card>
              )
            )}
          </div>
        </div>
      </Card>

      {/* Listar Pedidos */}
      <Card>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Listar Pedidos</h3>
          <Button onClick={handleListOrders} className="w-full">
            Listar Todos os Pedidos
          </Button>
          {loadingList ? (
            <div className="p-6 space-y-4">
              <div className="flex flex-col space-y-3">
                <Skeleton className="rounded-xl w-full h-6" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          ) : (
            listResponse && (
              <div className="space-y-4">
                {listResponse.map((order) => (
                  <Card key={order.id}>
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-semibold">
                        Pedido {order.id}
                      </h3>
                      <p>
                        <strong>ID do Cliente:</strong> {order.customerId}
                      </p>
                      <p>
                        <strong>Item:</strong> {order.item}
                      </p>
                      <p>
                        <strong>Quantidade:</strong> {order.quantity}
                      </p>
                    </div>
                  </Card>
                ))}
                <Button onClick={() => setShowFullResponse(!showFullResponse)}>
                  {showFullResponse
                    ? 'Esconder Resposta JSON'
                    : 'Mostrar Resposta JSON'}
                </Button>
                {showFullResponse && (
                  <pre className="bg-gray-900 text-white p-4 rounded-md overflow-auto">
                    {JSON.stringify(listResponse, null, 2)}
                  </pre>
                )}
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
}
