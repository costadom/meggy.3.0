import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CreditCard, QrCode, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const CheckoutPage = () => {
  const [selectedPackage, setSelectedPackage] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const packages = [
    { credits: 50, price: 50, discount: 0 },
    { credits: 100, price: 95, discount: 5 },
    { credits: 200, price: 180, discount: 10 },
    { credits: 500, price: 425, discount: 15 },
  ];

  const selectedPkgData = packages.find(p => p.credits === selectedPackage);
  const subtotal = selectedPkgData?.price || 0;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const history = [
    { id: 1, date: '10/03/2026', package: '100 Créditos', value: 'R$ 99,75', status: 'Aprovado' },
    { id: 2, date: '25/02/2026', package: '50 Créditos', value: 'R$ 52,50', status: 'Aprovado' },
    { id: 3, date: '14/02/2026', package: '200 Créditos', value: 'R$ 189,00', status: 'Aprovado' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      <Helmet>
        <title>Recarregar Créditos | Meggy</title>
      </Helmet>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Recarregue seus <span className="text-[#D946EF]">créditos</span>
          </h1>
          <p className="text-gray-400">Escolha o pacote ideal e aproveite sessões exclusivas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Packages & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Packages Grid */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D946EF]/20 text-[#D946EF] text-sm">1</span>
                Escolha um pacote
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg.credits}
                    onClick={() => setSelectedPackage(pkg.credits)}
                    className={`
                      relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${selectedPackage === pkg.credits 
                        ? 'border-[#D946EF] bg-[#D946EF]/10 shadow-[0_0_20px_rgba(217,70,239,0.2)]' 
                        : 'border-white/10 bg-[#1F1F1F] hover:border-white/30 hover:bg-white/5'
                      }
                    `}
                  >
                    {pkg.discount > 0 && (
                      <Badge className="absolute -top-3 -right-3 bg-green-500 text-white hover:bg-green-600 border-none">
                        {pkg.discount}% OFF
                      </Badge>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-2xl font-bold text-white">{pkg.credits} CR</span>
                      {selectedPackage === pkg.credits && <CheckCircle2 className="w-6 h-6 text-[#D946EF]" />}
                    </div>
                    <p className="text-gray-400">R$ {pkg.price.toFixed(2).replace('.', ',')}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D946EF]/20 text-[#D946EF] text-sm">2</span>
                Forma de pagamento
              </h2>
              <Card className="bg-[#1F1F1F] border-white/10">
                <CardContent className="p-6">
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'credit_card' ? 'border-[#D946EF] bg-[#D946EF]/5' : 'border-white/10 hover:bg-white/5'}`} onClick={() => setPaymentMethod('credit_card')}>
                      <RadioGroupItem value="credit_card" id="credit_card" className="border-white/30 text-[#D946EF]" />
                      <Label htmlFor="credit_card" className="flex-1 flex items-center gap-3 cursor-pointer text-white">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        Cartão de Crédito
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'pix' ? 'border-[#D946EF] bg-[#D946EF]/5' : 'border-white/10 hover:bg-white/5'}`} onClick={() => setPaymentMethod('pix')}>
                      <RadioGroupItem value="pix" id="pix" className="border-white/30 text-[#D946EF]" />
                      <Label htmlFor="pix" className="flex-1 flex items-center gap-3 cursor-pointer text-white">
                        <QrCode className="w-5 h-5 text-gray-400" />
                        PIX (Aprovação instantânea)
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === 'credit_card' && (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Número do Cartão</Label>
                        <Input placeholder="0000 0000 0000 0000" className="bg-black/20 border-white/10 text-white placeholder:text-gray-600" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Nome no Cartão</Label>
                        <Input placeholder="NOME IMPRESSO" className="bg-black/20 border-white/10 text-white placeholder:text-gray-600" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-300">Validade</Label>
                          <Input placeholder="MM/AA" className="bg-black/20 border-white/10 text-white placeholder:text-gray-600" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-300">CVV</Label>
                          <Input placeholder="123" className="bg-black/20 border-white/10 text-white placeholder:text-gray-600" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="space-y-6">
            <Card className="bg-[#1F1F1F] border-white/10 sticky top-24">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-xl text-white">Resumo da Compra</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Pacote selecionado</span>
                  <span className="font-medium text-white">{selectedPackage} CR</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Taxa de processamento (5%)</span>
                  <span>R$ {tax.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-[#D946EF]">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="pt-6 space-y-3">
                  <Button className="w-full bg-[#D946EF] hover:bg-[#c026d3] text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(217,70,239,0.3)] hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] transition-all">
                    Confirmar Pagamento <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 py-6">
                    Cancelar
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                  <ShieldCheck className="w-4 h-4" />
                  Pagamento 100% seguro e criptografado
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* History Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Histórico de Recargas</h2>
          <Card className="bg-[#1F1F1F] border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="border-white/10 bg-black/20">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-gray-400">Data</TableHead>
                  <TableHead className="text-gray-400">Pacote</TableHead>
                  <TableHead className="text-gray-400">Valor</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-gray-300">{item.date}</TableCell>
                    <TableCell className="text-white font-medium">{item.package}</TableCell>
                    <TableCell className="text-gray-300">{item.value}</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none">
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;