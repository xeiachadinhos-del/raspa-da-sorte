'use client';

interface Prize {
  id: string;
  name: string;
  image: string;
  value: string;
  price: number;
}

interface PrizesDisplayProps {
  title?: string;
  description?: string;
}

export default function PrizesDisplay({ 
  title = "Prêmios Disponíveis", 
  description = "Confira todos os prêmios que você pode ganhar na TechMania!" 
}: PrizesDisplayProps) {
  // Prêmios da raspadinha TechMania
  const prizes: Prize[] = [
    {
      id: '1',
      name: 'Caixa de som JBL Boombox 3',
      image: 'https://ik.imagekit.io/azx3nlpdu/variant_jbl_boombox_3_black.png?updatedAt=1751634894498',
      value: 'R$ 2.500,00',
      price: 2500
    },
    {
      id: '2',
      name: 'iPhone 12',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_iphone_12.png?updatedAt=1751634890863',
      value: 'R$ 2.500,00',
      price: 2500
    },
    {
      id: '3',
      name: '1.000 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/1K.png?updatedAt=1752865094958',
      value: 'R$ 1.000,00',
      price: 1000
    },
    {
      id: '4',
      name: 'Smartphone modelo C2 NK109',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_c2_nk109.png?updatedAt=1751634895731',
      value: 'R$ 800,00',
      price: 800
    },
    {
      id: '5',
      name: '700 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/700.png?updatedAt=1752856623225',
      value: 'R$ 700,00',
      price: 700
    },
    {
      id: '6',
      name: 'Bola de futebol tamanho 5',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_ft_5_branca_e_preta.png?updatedAt=1751634891004',
      value: 'R$ 500,00',
      price: 500
    },
    {
      id: '7',
      name: 'Perfume 212 VIP Black',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_212_vip_black.png?updatedAt=1751634894437',
      value: 'R$ 399,00',
      price: 399
    },
    {
      id: '8',
      name: 'Camisa de time de futebol',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_camisa_do_seu_time.png?updatedAt=1751634896240',
      value: 'R$ 350,00',
      price: 350
    },
    {
      id: '9',
      name: 'Fone de ouvido Lenovo',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_fone_de_ouvido_lenovo.png?updatedAt=1751634891006',
      value: 'R$ 220,00',
      price: 220
    },
    {
      id: '10',
      name: '200 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/200-REAIS.png?updatedAt=1752865094953',
      value: 'R$ 200,00',
      price: 200
    },
    {
      id: '11',
      name: 'Copo Stanley preto',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_copo_t_rmico_stanley_preto.png?updatedAt=1751634897660',
      value: 'R$ 165,00',
      price: 165
    },
    {
      id: '12',
      name: '100 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/Notas/100%20REAIS.png?updatedAt=1752047821876',
      value: 'R$ 100,00',
      price: 100
    },
    {
      id: '13',
      name: 'PowerBank',
      image: 'https://ik.imagekit.io/azx3nlpdu/banner/01K0F5KTMSEJBQF1STFZ4BCKXM.png',
      value: 'R$ 60,00',
      price: 60
    },
    {
      id: '14',
      name: '50 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/Notas/50%20REAIS.png?updatedAt=1752047821745',
      value: 'R$ 50,00',
      price: 50
    },
    {
      id: '15',
      name: 'Chinelo Havaianas branco',
      image: 'https://ik.imagekit.io/azx3nlpdu/item_chinelo_havaianas_top_branco.png?updatedAt=1751634896291',
      value: 'R$ 35,00',
      price: 35
    },
    {
      id: '16',
      name: '10 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/Notas/10%20REAIS.png?updatedAt=1752047821681',
      value: 'R$ 10,00',
      price: 10
    },
    {
      id: '17',
      name: '5 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/Notas/5%20REAIS.png?updatedAt=1752047821734',
      value: 'R$ 5,00',
      price: 5
    },
    {
      id: '18',
      name: '3 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/Notas/3%20REAIS.png?updatedAt=1752047821897',
      value: 'R$ 3,00',
      price: 3
    },
    {
      id: '19',
      name: '2 Reais',
      image: 'https://ik.imagekit.io/azx3nlpdu/Notas/2%20REAIS.png?updatedAt=1752047821644',
      value: 'R$ 2,00',
      price: 2
    },
    {
      id: '20',
      name: '1 Real',
      image: 'https://ik.imagekit.io/azx3nlpdu/Notas/1%20REAL.png?updatedAt=1752047821586',
      value: 'R$ 1,00',
      price: 1
    }
  ];

  // Ordenar prêmios por valor (maior para menor)
  const sortedPrizes = [...prizes].sort((a, b) => b.price - a.price);

  return (
    <div className="bg-[#191919] rounded-lg p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      
      {/* Scroll horizontal dos prêmios */}
      <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
        {sortedPrizes.map((prize) => (
          <div 
            key={prize.id} 
            className="flex-shrink-0 w-36 h-[200px] bg-gradient-to-t from-green-500/20 from-[0%] to-[35%] to-blue-500/20 border-2 border-gray-700 p-3 rounded-lg cursor-pointer hover:border-green-500/50 transition-all duration-300 group"
          >
            <div className="flex flex-col h-full">
              {/* Imagem do prêmio */}
              <div className="flex-1 flex items-center justify-center mb-3">
                <img 
                  src={prize.image} 
                  alt={prize.name}
                  className="w-full h-full p-2 object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Nome do prêmio */}
              <h4 className="text-xs font-semibold text-white mb-2 text-center leading-tight line-clamp-2">
                {prize.name}
              </h4>
              
              {/* Valor do prêmio */}
              <div className="px-2 py-1 bg-white text-black rounded text-xs font-bold text-center self-center">
                {prize.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicador de scroll */}
      <div className="text-center">
        <p className="text-gray-500 text-xs">
          ← Deslize para ver todos os prêmios →
        </p>
      </div>
    </div>
  );
}
