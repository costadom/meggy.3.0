import Link from 'next/link';
import { ShieldCheck, Clock, HeartHandshake, Coins, Zap, CheckCircle2 } from 'lucide-react';

// SEO Otimizado para o Google
export const metadata = {
  title: 'Meggy | Escolha sua gamer e agende sua sessão exclusiva',
  description: 'A plataforma premium para conectar você às melhores gamers para sessões exclusivas por vídeo.',
};

// Importações dos seus componentes (logo vamos arrumar a pasta deles)
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorks from '@/components/HowItWorks';
import Categories from '@/components/Categories';
import FeaturedModels from '@/components/FeaturedModels';
import BecomeModelSection from '@/components/BecomeModelSection';
import FAQSection from '@/components/FAQSection';

export default function HomePage() {
  const fictionalModels = [
    {
      id: 1,
      name: 'Juju Bates',
      description: 'Gameplay e conversa com vídeo. Estilo namoradinha, ideal para quem quer jogar, conversar e ter uma companhia mais próxima.',
      price: 50,
      credits: 50,
      badges: ['Nova', 'Agenda aberta'],
      image: 'https://images.unsplash.com/photo-1693880269247-97721478c508?q=80&w=800'
    },
    {
      id: 2,
      name: 'Luna',
      description: 'Gameplay + conversa. Luna oferece sessões leves, divertidas e personalizadas.',
      price: 79,
      credits: 79,
      badges: ['Mais procurada', 'Online agora', '⭐ 4.9'],
      image: 'https://images.unsplash.com/photo-1696881870307-49a700833b62?q=80&w=800'
    },
    {
      id: 3,
      name: 'Maya',
      description: 'Joga junto. Maya tem um perfil mais intenso e competitivo, ideal para uma sessão com energia.',
      price: 99,
      credits: 99,
      badges: ['Disponível hoje', '⭐ 5.0'],
      image: 'https://images.unsplash.com/photo-1648873882408-e49707dfd74a?q=80&w=800'
    },
    {
      id: 4,
      name: 'Jefferson Queiroz',
      description: 'Gameplay puro. Parceiro ideal para sessões de gameplay intenso e competição.',
      price: 60,
      credits: 60,
      badges: ['Online agora'],
      image: 'https://images.unsplash.com/photo-1589241062313-35890684416a?q=80&w=800'
    },
    {
      id: 5,
      name: 'Rafael Costa',
      description: 'Conversa e companhia. Ideal para quem quer bom papo e companhia descontraída.',
      price: 45,
      credits: 45,
      badges: ['Nova'],
      image: 'https://images.unsplash.com/photo-1654154831180-ce1dc088b8be?q=80&w=800'
    },
    {
      id: 6,
      name: 'Sophia Martins',
      description: 'Conversa + gameplay. Sophia combina bom papo, diversão e sessões personalizadas.',
      price: 55,
      credits: 55,
      badges: ['Online agora', '⭐ 4.8'],
      image: 'https://images.unsplash.com/photo-1690673816058-e89bd0d2e45e?q=80&w=800'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col dark">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-16 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1694855801642-cf7e422bfd95?q=80&w=2000" 
              alt="Gamer setup with neon lights" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/30 border-primary/50 px-4 py-1.5 text-sm backdrop-blur-sm">
                A plataforma premium de gamers
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
                Escolha sua gamer e agende sua <span className="text-primary drop-shadow-[0_0_25px_rgba(255,0,255,0.6)]">sessão exclusiva</span> por vídeo
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
                Conecte-se com as melhores jogadoras, agende horários flexíveis e desfrute de partidas inesquecíveis com companhia premium.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(255,0,255,0.4)] hover:shadow-[0_0_30px_rgba(255,0,255,0.6)] transition-all duration-300 text-lg px-8 h-14" asChild>
                  <Link href="/modelos">Ver Modelos</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary/50 text-white hover:bg-primary/10 hover:border-primary transition-all duration-300 text-lg px-8 h-14 backdrop-blur-sm" asChild>
                  <Link href="/cadastro-cliente">Criar Conta</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Componentes da Hostinger (Serão carregados assim que movermos a pasta) */}
        <HowItWorks />
        <Categories />
        <FeaturedModels models={fictionalModels} />
        <BecomeModelSection />

        {/* Differentials */}
        <section className="py-24 bg-card/20 border-y border-border/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Por que escolher a Meggy?</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Nossa plataforma foi desenhada para oferecer a melhor experiência premium.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: 'Modelos verificadas', desc: 'Todas as gamers passam por um rigoroso processo de verificação de identidade.' },
                { icon: Clock, title: 'Agenda visível', desc: 'Veja a disponibilidade real de cada modelo antes de comprar créditos.' },
                { icon: Zap, title: 'Agendamento fácil', desc: 'Sistema intuitivo para marcar suas sessões sem burocracia.' },
                { icon: HeartHandshake, title: 'Atendimento personalizado', desc: 'Suporte dedicado para garantir que sua experiência seja perfeita.' },
                { icon: Coins, title: 'Saldo em créditos', desc: 'Compre pacotes de créditos e use com qualquer modelo da plataforma.' },
                { icon: CheckCircle2, title: 'Suporte rápido', desc: 'Equipe pronta para resolver qualquer dúvida ou problema rapidamente.' }
              ].map((diff, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,255,0.1)] group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                      <diff.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-white">{diff.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{diff.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
