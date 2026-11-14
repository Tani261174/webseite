import type { LessonBody } from "../types";

/**
 * Musterlektion (vollständig ausgearbeitet, Spanisch).
 * Kurs: Amazon Business Masterclass · Modul 1 · Lektion 1
 * Hinweis: Programmbedingungen, Gebühren und Provisionen ändern sich und unterscheiden sich je Land.
 * Deshalb nennt die Lektion bewusst keine festen Gebührenbeträge, sondern verweist auf die offiziellen Seiten.
 */
export const amazonSampleLesson: LessonBody = {
  lang: "es",
  intro:
    "Cuando alguien dice «gano dinero con Amazon» puede estar hablando de cosas muy distintas. Un creador que recomienda productos, una persona que importa y vende su propia marca y una autora que publica su libro trabajan de forma completamente diferente. En esta lección vas a conocer los cinco modelos principales, qué exige cada uno y cómo elegir el que mejor encaja contigo para empezar.",
  objectives: [
    "Distinguir los cinco modelos de negocio más habituales en Amazon.",
    "Entender qué necesitas en cada modelo: producto, inversión, tiempo y habilidades.",
    "Evaluar riesgos de forma realista antes de invertir dinero.",
    "Elegir un modelo de inicio con una decisión razonada, no por impulso.",
  ],
  blocks: [
    { type: "h", text: "1. Amazon no es un solo negocio" },
    {
      type: "p",
      text:
        "Amazon funciona como varios ecosistemas a la vez: una tienda donde terceros venden productos, una red de afiliados que recibe comisiones por recomendar, una plataforma de autopublicación de libros y una empresa de logística. Cada uno de esos ecosistemas tiene sus propias reglas, sus propias cuentas y sus propias condiciones según el país (amazon.es, amazon.com.mx, amazon.com, amazon.de, etc.).",
    },
    {
      type: "callout",
      title: "Importante desde el primer día",
      text:
        "Las condiciones, tarifas y comisiones cambian con el tiempo y varían por país. En este curso te enseñamos a encontrarlas y a calcular con ellas, pero consulta siempre la página oficial del programa en tu marketplace antes de tomar decisiones.",
    },
    { type: "h", text: "2. Los cinco modelos" },
    { type: "p", text: "Modelo 1 – Amazon Afiliados. Recomiendas productos de Amazon mediante enlaces especiales en tu web, blog, redes o newsletter. Si alguien compra a través de tu enlace, recibes una comisión que depende de la categoría del producto y del país. No necesitas producto propio ni stock. Tu trabajo es crear contenido útil y ganarte la confianza de tu audiencia." },
    { type: "p", text: "Modelo 2 – Programa de Influencers de Amazon. Es una extensión del programa de afiliados pensada para creadores con presencia en redes sociales. Si te aceptan, obtienes una página de tienda propia dentro de Amazon donde reúnes tus recomendaciones y, en algunos países, puedes publicar vídeos de producto. Amazon revisa cada solicitud y no está disponible en todos los marketplaces." },
    { type: "p", text: "Modelo 3 – Vender con FBA (Fulfillment by Amazon / Logística de Amazon). Vendes tus propios productos (comprados a un fabricante, de marca propia o de reventa) a través de una cuenta de vendedor en Seller Central. Envías el stock a los almacenes de Amazon y Amazon se encarga de almacenar, preparar y enviar los pedidos, además de gestionar devoluciones y atención al cliente de esos pedidos. A cambio pagas tarifas de logística y almacenamiento." },
    { type: "p", text: "Modelo 4 – Vender con FBM (Fulfilled by Merchant / envío por el vendedor). También vendes tus propios productos en Seller Central, pero tú almacenas y envías los pedidos. Tienes más control y menos tarifas de logística de Amazon, pero más trabajo operativo y la responsabilidad de cumplir los plazos de entrega." },
    { type: "p", text: "Modelo 5 – Amazon KDP (Kindle Direct Publishing). Publicas tu propio libro como e-book y, si quieres, como libro impreso. Publicar no tiene coste inicial y los libros impresos se fabrican bajo demanda, así que no necesitas almacén. Recibes regalías: en los e-books Amazon ofrece dos opciones de regalías (35 % y 70 %, esta última con requisitos de precio y territorio) y en los impresos se descuenta el coste de impresión. Lo que sí inviertes es tiempo y, opcionalmente, dinero en corrección, maquetación o portada." },
    { type: "h", text: "3. Comparación rápida" },
    {
      type: "table",
      head: ["Modelo", "¿Producto propio?", "Inversión inicial típica", "Trabajo principal", "Riesgo económico"],
      rows: [
        ["Afiliados", "No", "Baja: sobre todo tiempo", "Crear contenido y recomendar", "Bajo; ingresos muy variables"],
        ["Influencer", "No", "Baja: tiempo y equipo básico", "Vídeos y contenido en redes", "Bajo; requiere aprobación"],
        ["FBA", "Sí", "Media o alta: stock y tarifas", "Producto, envíos a Amazon, publicidad", "Medio-alto: stock inmovilizado"],
        ["FBM", "Sí", "Media: stock y envíos", "Producto, almacén y envíos propios", "Medio"],
        ["KDP", "Sí, tu libro", "Baja: tiempo; diseño opcional", "Escribir, maquetar, publicar, promocionar", "Bajo"],
      ],
    },
    {
      type: "callout",
      title: "Sin promesas falsas",
      text:
        "Ningún modelo garantiza ingresos. Hay personas que ganan dinero con cada uno de ellos y muchas que no. La diferencia suele estar en la constancia, en entender los números y en ofrecer algo realmente útil. Desconfía de quien te prometa resultados rápidos.",
    },
    { type: "h", text: "4. Cómo elegir tu modelo de inicio" },
    { type: "p", text: "No tienes que elegir para siempre. Muchos negocios combinan modelos: por ejemplo, empezar con contenido y afiliados, y más adelante lanzar un libro o un producto propio. Para tu primer paso, responde con honestidad a cuatro preguntas:" },
    {
      type: "list",
      ordered: true,
      items: [
        "Presupuesto: ¿cuánto dinero puedes invertir sin poner en riesgo tus gastos básicos?",
        "Tiempo: ¿cuántas horas reales a la semana puedes dedicar durante los próximos tres meses?",
        "Habilidades: ¿te resulta más natural crear contenido, escribir, o negociar y organizar logística?",
        "Tolerancia al riesgo: ¿cómo te sentirías si una inversión no se recupera?",
      ],
    },
    {
      type: "example",
      title: "Ejemplo práctico (caso ficticio): Lucía, 4 horas por semana y poco presupuesto",
      text: [
        "Lucía trabaja a tiempo completo, le encanta la cocina saludable y ya comparte recetas en Instagram. Tiene unas 4 horas libres por semana y no quiere invertir más de lo que puede permitirse perder.",
        "FBA no encaja ahora mismo: exigiría comprar stock, calcular tarifas y gestionar envíos a almacenes, algo difícil con 4 horas semanales y poco capital.",
        "Afiliados sí encaja: puede recomendar en sus recetas los utensilios que realmente usa, indicando claramente que son enlaces de afiliado.",
        "KDP es una buena segunda etapa: con sus recetas propias puede preparar un recetario. Primero valida qué recetas interesan más a su audiencia.",
        "Decisión razonada: empezar con afiliados durante 90 días, medir resultados y preparar en paralelo el índice de su libro.",
      ],
    },
    { type: "h", text: "5. Errores frecuentes al empezar" },
    {
      type: "list",
      items: [
        "Elegir el modelo que «más dinero da» según un vídeo, en lugar del que encaja con tu situación.",
        "Invertir en stock antes de entender tarifas, márgenes y demanda.",
        "Publicar enlaces de afiliado sin indicarlo: además de restar confianza, incumple las normas del programa y la normativa de publicidad.",
        "Copiar contenido o libros de otros: Amazon puede retirar productos y cerrar cuentas por infracciones de derechos.",
        "Publicar en KDP contenido generado con IA sin revisarlo ni declararlo cuando la plataforma lo pide.",
      ],
    },
    {
      type: "exercise",
      title: "Ejercicio: tu mapa de decisión (15–20 minutos)",
      steps: [
        "Descarga la hoja de trabajo de esta lección o usa una hoja en blanco.",
        "Escribe tu presupuesto máximo, tus horas semanales reales y tus tres habilidades más fuertes.",
        "Puntúa del 1 al 5 cada modelo (Afiliados, Influencer, FBA, FBM, KDP) según cómo encaja con esos datos.",
        "Elige un modelo principal para los próximos 90 días y, si quieres, uno secundario.",
        "Escribe en una frase por qué lo eliges. Guarda la hoja: la usaremos en el plan de acción de 90 días (módulo 15).",
      ],
    },
  ],
  quiz: [
    {
      q: "¿Qué modelo NO requiere tener un producto propio?",
      options: ["Vender con FBA", "Amazon Afiliados", "Vender con FBM", "Publicar con KDP"],
      correct: 1,
      explain: "En Amazon Afiliados recomiendas productos que ya existen en Amazon y recibes una comisión por las compras realizadas a través de tu enlace.",
    },
    {
      q: "Si vendes con FBA, ¿quién almacena y envía los pedidos?",
      options: ["Tú mismo desde casa", "Una agencia que tú contratas obligatoriamente", "Amazon, desde sus centros logísticos", "El fabricante del producto"],
      correct: 2,
      explain: "En FBA envías tu stock a Amazon y Amazon se encarga del almacenamiento, el envío y las devoluciones de esos pedidos, a cambio de tarifas.",
    },
    {
      q: "Al publicar enlaces de afiliado en tus redes, ¿qué debes hacer?",
      options: ["Nada, es opcional", "Indicar de forma clara que son enlaces de afiliado", "Ocultar el enlace en un acortador", "Usarlos solo en mensajes privados"],
      correct: 1,
      explain: "La transparencia es obligatoria según las normas del programa y la normativa de publicidad de muchos países. Además, genera confianza.",
    },
    {
      q: "¿Qué afirmación sobre KDP es correcta?",
      options: [
        "Hay que pagar una cuota para publicar cada libro",
        "Debes imprimir y almacenar los libros tú mismo",
        "Publicar no tiene coste inicial y los libros impresos se fabrican bajo demanda",
        "Solo se pueden publicar e-books",
      ],
      correct: 2,
      explain: "KDP permite publicar e-books y libros impresos sin coste inicial; los impresos se fabrican cuando alguien los compra.",
    },
    {
      q: "¿Cuál es la mejor forma de elegir tu primer modelo?",
      options: [
        "El que más dinero promete en internet",
        "Según tu presupuesto, tiempo, habilidades y tolerancia al riesgo",
        "Empezar con todos a la vez",
        "El que use la mayoría de tus amigos",
      ],
      correct: 1,
      explain: "Un buen comienzo se basa en tu situación real. Puedes combinar modelos más adelante.",
    },
  ],
  takeaways: [
    "«Ganar dinero con Amazon» abarca al menos cinco modelos muy distintos.",
    "Afiliados e Influencer no requieren stock; FBA y FBM sí; KDP requiere tu propio libro.",
    "Las condiciones varían por país y cambian: consulta siempre las fuentes oficiales.",
    "Ningún modelo garantiza ingresos; elige según tu situación y mide resultados.",
  ],
};
