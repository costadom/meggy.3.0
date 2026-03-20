import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    // Cadastro (2)
    {
      question: 'Como funciona o cadastro na plataforma?',
      answer: 'O cadastro é totalmente gratuito e rápido. Basta clicar em "Criar Conta", preencher seus dados básicos (nome, email, senha) e confirmar seu email. Após isso, você já pode navegar pelos perfis e comprar créditos.'
    },
    {
      question: 'Preciso pagar alguma mensalidade para usar a Meggy?',
      answer: 'Não! A Meggy não cobra mensalidades ou taxas de assinatura dos clientes. Você paga apenas pelos créditos que comprar para utilizar nas sessões com as modelos.'
    },
    // Créditos (3)
    {
      question: 'Como compro créditos e qual o valor?',
      answer: 'Após fazer login, acesse seu painel e clique em "Comprar Créditos". Oferecemos diversos pacotes com pagamento seguro via PIX ou cartão de crédito. O valor de 1 crédito equivale a R$ 1,00.'
    },
    {
      question: 'Os créditos têm validade?',
      answer: 'Não, seus créditos não expiram. Uma vez comprados, eles ficam disponíveis na sua carteira até que você os utilize em agendamentos.'
    },
    {
      question: 'Posso pedir reembolso dos meus créditos?',
      answer: 'O reembolso pode ser solicitado em até 7 dias após a compra, desde que os créditos não tenham sido utilizados em nenhuma sessão. Consulte nossos Termos de Serviço para mais detalhes.'
    },
    // Agendamento (2)
    {
      question: 'Como faço para agendar uma sessão?',
      answer: 'Escolha a modelo desejada, clique em "Agendar", selecione um horário disponível na agenda dela e confirme. O valor em créditos será deduzido do seu saldo automaticamente.'
    },
    {
      question: 'O que acontece se a modelo não comparecer?',
      answer: 'Se a modelo não comparecer no horário agendado, o valor integral da sessão em créditos será devolvido automaticamente para a sua carteira.'
    },
    // Aprovação de Modelos (3)
    {
      question: 'Como as modelos são aprovadas na plataforma?',
      answer: 'Todas as modelos passam por um rigoroso processo de verificação de identidade. Exigimos o envio de documentos oficiais com foto e uma selfie segurando o documento para garantir a segurança de todos.'
    },
    {
      question: 'Qualquer pessoa pode ser modelo na Meggy?',
      answer: 'Sim, desde que seja maior de 18 anos, possua um computador ou celular com boa câmera e internet, e seja aprovada em nosso processo de verificação de identidade e perfil.'
    },
    {
      question: 'Quanto tempo demora a aprovação de uma nova modelo?',
      answer: 'Nossa equipe analisa os cadastros de novas modelos em até 48 horas úteis. Assim que aprovada, a modelo já pode configurar sua agenda e começar a receber agendamentos.'
    }
  ];

  return (
    <section className="py-20 bg-[#0F0F0F] border-y border-white/5">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-[#D1D5DB] text-lg">
            Encontre respostas para as dúvidas mais comuns
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`} 
              className="border border-white/10 bg-[#1F1F1F] rounded-xl px-6 data-[state=open]:border-[#D946EF]/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <AccordionTrigger className="text-base md:text-lg font-bold text-white py-5 hover:text-[#D946EF] hover:no-underline transition-colors text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[#D1D5DB] text-sm md:text-base pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;