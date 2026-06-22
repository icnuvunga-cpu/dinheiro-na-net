export const siteConfig = {
    title: "Dinheiro na Net",
    description: "Aprende a criar renda digital com blogs, IA, afiliados e ferramentas online. Guias práticos para lusófonos.",
    url: "https://dinheiro-na-net.icnuvunga.workers.dev",
};

export const contactConfig = {
    publicName: "Equipa Dinheiro na Net",
    whatsappDisplay: "+258 87 365 9275",
    whatsappNumber: "258873659275",
};

export const whatsappMessages = {
    general: "Olá, Equipa Dinheiro na Net. Tenho uma dúvida e gostaria de receber orientação.",
    quote: "Olá, Equipa Dinheiro na Net. Gostaria de pedir um orçamento.\n\nObjetivo:\nTipo de ajuda:\nPrazo:\nContexto ou link:",
    services: "Olá, Equipa Dinheiro na Net. Vi a página de Serviços e gostaria de saber mais sobre uma possível ajuda para o meu projeto.",
    partnership: "Olá, Equipa Dinheiro na Net. Gostaria de apresentar uma possível parceria ou recomendação.\n\nNome ou projeto:\nTipo de recurso:\nLink ou contexto:\nMotivo do contacto:",
    contentQuestion: "Olá, Equipa Dinheiro na Net. Tenho uma dúvida sobre um conteúdo do site.\n\nPágina ou artigo:\nA minha dúvida:\nContexto adicional:",
};

export const buildWhatsAppHref = (message: string) =>
    `https://wa.me/${contactConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const categories = [
    { name: "Começar do Zero", slug: "comecar-do-zero", description: "O básico para criares uma base digital com expectativas realistas." },
    { name: "IA e Produtividade", slug: "ia-e-produtividade", description: "Como usar inteligência artificial com revisão humana e utilidade real." },
    { name: "Afiliados e Ferramentas", slug: "afiliados-e-ferramentas", description: "Análise educativa de programas de afiliados e ferramentas digitais." },
    { name: "Pagamentos Online", slug: "pagamentos-online", description: "Como pensar pagamentos em países da lusofonia e no trabalho remoto." },
    { name: "Ferramentas Gratuitas", slug: "ferramentas-gratuitas", description: "Recursos grátis para planear e validar ideias online." },
];

export const navigation = [
    { name: "Home", href: "/" },
    { name: "Categorias", href: "/categorias" },
    { name: "Ferramentas", href: "/ferramentas" },
    { name: "Sobre", href: "/sobre" },
    { name: "Contacto", href: "/contacto" },
];
