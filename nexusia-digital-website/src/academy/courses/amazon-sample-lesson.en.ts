import type { LessonBody } from "../types";

/** Sample lesson – English version (same content as the Spanish original). */
export const amazonSampleLessonEn: LessonBody = {
  lang: "en",
  intro:
    "When someone says “I make money with Amazon”, they could mean very different things. A creator who recommends products, a seller who imports and sells their own brand and an author who publishes a book all work in completely different ways. In this lesson you'll get to know the five main models, what each one requires and how to choose the one that fits you best to get started.",
  objectives: [
    "Tell apart the five most common business models on Amazon.",
    "Understand what each model needs: product, budget, time and skills.",
    "Assess risks realistically before investing money.",
    "Choose a starting model with a reasoned decision, not on impulse.",
  ],
  blocks: [
    { type: "h", text: "1. Amazon is not just one business" },
    {
      type: "p",
      text:
        "Amazon works as several ecosystems at once: a marketplace where third parties sell products, an affiliate network that pays commissions for recommendations, a self-publishing platform for books and a logistics company. Each of these ecosystems has its own rules, its own accounts and its own terms depending on the country (amazon.com, amazon.co.uk, amazon.de, amazon.es, etc.).",
    },
    {
      type: "callout",
      title: "Important from day one",
      text:
        "Terms, fees and commissions change over time and vary by country. In this course we show you how to find them and calculate with them – but always check the official programme page for your marketplace before making decisions.",
    },
    { type: "h", text: "2. The five models" },
    { type: "p", text: "Model 1 – Amazon Associates (affiliate). You recommend Amazon products using special links on your website, blog, social media or newsletter. If someone buys through your link, you earn a commission that depends on the product category and the country. You don't need your own product or any stock. Your job is to create useful content and earn your audience's trust." },
    { type: "p", text: "Model 2 – Amazon Influencer Program. An extension of the affiliate programme for creators with a social media presence. If you're accepted, you get your own storefront page on Amazon where you gather your recommendations and, in some countries, you can publish product videos. Amazon reviews every application, and the programme isn't available on every marketplace." },
    { type: "p", text: "Model 3 – Selling with FBA (Fulfillment by Amazon). You sell your own products (bought from a manufacturer, private label or resale) through a seller account in Seller Central. You send your stock to Amazon's warehouses and Amazon stores, packs and ships the orders, and also handles returns and customer service for those orders. In return you pay fulfilment and storage fees." },
    { type: "p", text: "Model 4 – Selling with FBM (Fulfilled by Merchant). You also sell your own products in Seller Central, but you store and ship the orders yourself. You have more control and fewer Amazon fulfilment fees, but more operational work and responsibility for meeting delivery times." },
    { type: "p", text: "Model 5 – Amazon KDP (Kindle Direct Publishing). You publish your own book as an e-book and, if you like, as a print book. Publishing costs nothing upfront and print books are produced on demand, so you don't need a warehouse. You earn royalties: for e-books Amazon offers two royalty options (35% and 70%, the latter with price and territory requirements), and for print books the printing cost is deducted. What you do invest is time and, optionally, money for editing, formatting or a cover." },
    { type: "h", text: "3. Quick comparison" },
    {
      type: "table",
      head: ["Model", "Own product?", "Typical initial investment", "Main work", "Financial risk"],
      rows: [
        ["Affiliate", "No", "Low: mostly time", "Creating content and recommending", "Low; income varies a lot"],
        ["Influencer", "No", "Low: time and basic gear", "Videos and social media content", "Low; requires approval"],
        ["FBA", "Yes", "Medium to high: stock and fees", "Product, shipments to Amazon, advertising", "Medium to high: money tied up in stock"],
        ["FBM", "Yes", "Medium: stock and shipping", "Product, own storage and shipping", "Medium"],
        ["KDP", "Yes, your book", "Low: time; design optional", "Writing, formatting, publishing, promoting", "Low"],
      ],
    },
    {
      type: "callout",
      title: "No false promises",
      text:
        "No model guarantees income. Some people make money with each of them, and many don't. The difference usually comes down to consistency, understanding the numbers and offering something genuinely useful. Be wary of anyone promising you quick results.",
    },
    { type: "h", text: "4. How to choose your starting model" },
    { type: "p", text: "You don't have to choose forever. Many businesses combine models: for example, starting with content and affiliate links, and later launching a book or your own product. For your first step, answer four questions honestly:" },
    {
      type: "list",
      ordered: true,
      items: [
        "Budget: how much money can you invest without putting your basic expenses at risk?",
        "Time: how many real hours per week can you commit over the next three months?",
        "Skills: what comes more naturally to you – creating content, writing, or negotiating and organising logistics?",
        "Risk tolerance: how would you feel if an investment didn't pay off?",
      ],
    },
    {
      type: "example",
      title: "Practical example (fictional case): Lucía, 4 hours a week and a small budget",
      text: [
        "Lucía works full time, loves healthy cooking and already shares recipes on Instagram. She has about 4 free hours a week and doesn't want to invest more than she can afford to lose.",
        "FBA isn't a fit right now: it would mean buying stock, calculating fees and managing shipments to warehouses – hard with 4 hours a week and little capital.",
        "Affiliate is a fit: in her recipes she can recommend the kitchen tools she really uses, clearly stating that they are affiliate links.",
        "KDP is a good second stage: her own recipes could become a cookbook. First she checks which recipes her audience is most interested in.",
        "Reasoned decision: start with affiliate links for 90 days, measure results and prepare her book's table of contents in parallel.",
      ],
    },
    { type: "h", text: "5. Common mistakes when starting out" },
    {
      type: "list",
      items: [
        "Choosing the model that “makes the most money” according to a video, instead of the one that fits your situation.",
        "Investing in stock before understanding fees, margins and demand.",
        "Posting affiliate links without disclosing them: besides costing trust, it breaks the programme rules and advertising law.",
        "Copying other people's content or books: Amazon can remove products and close accounts for rights infringements.",
        "Publishing AI-generated content on KDP without reviewing it and declaring it where the platform requires.",
      ],
    },
    {
      type: "exercise",
      title: "Exercise: your decision map (15–20 minutes)",
      steps: [
        "Download this lesson's worksheet or use a blank sheet of paper.",
        "Write down your maximum budget, your realistic weekly hours and your three strongest skills.",
        "Score each model (Affiliate, Influencer, FBA, FBM, KDP) from 1 to 5 based on how well it fits those details.",
        "Choose a main model for the next 90 days and, if you like, a secondary one.",
        "Write one sentence explaining why you chose it. Keep the sheet: we'll use it in the 90-day action plan (module 15).",
      ],
    },
  ],
  quiz: [
    {
      q: "Which model does NOT require your own product?",
      options: ["Selling with FBA", "Amazon Associates (affiliate)", "Selling with FBM", "Publishing with KDP"],
      correct: 1,
      explain: "With Amazon Associates you recommend products that already exist on Amazon and earn a commission on purchases made through your link.",
    },
    {
      q: "If you sell with FBA, who stores and ships the orders?",
      options: ["You, from home", "An agency you are required to hire", "Amazon, from its fulfilment centres", "The product's manufacturer"],
      correct: 2,
      explain: "With FBA you send your stock to Amazon, and Amazon handles storage, shipping and returns for those orders in exchange for fees.",
    },
    {
      q: "When you share affiliate links on social media, what must you do?",
      options: ["Nothing, it's optional", "Clearly state that they are affiliate links", "Hide the link behind a URL shortener", "Only use them in private messages"],
      correct: 1,
      explain: "Transparency is required by the programme rules and by advertising law in many countries. It also builds trust.",
    },
    {
      q: "Which statement about KDP is correct?",
      options: [
        "You have to pay a fee to publish each book",
        "You must print and store the books yourself",
        "Publishing costs nothing upfront and print books are produced on demand",
        "You can only publish e-books",
      ],
      correct: 2,
      explain: "KDP lets you publish e-books and print books with no upfront cost; print books are produced when someone buys them.",
    },
    {
      q: "What's the best way to choose your first model?",
      options: [
        "The one that promises the most money online",
        "Based on your budget, time, skills and risk tolerance",
        "Start with all of them at once",
        "The one most of your friends use",
      ],
      correct: 1,
      explain: "A good start is based on your real situation. You can combine models later.",
    },
  ],
  takeaways: [
    "“Making money with Amazon” covers at least five very different models.",
    "Affiliate and Influencer need no stock; FBA and FBM do; KDP needs your own book.",
    "Terms vary by country and change over time: always check the official sources.",
    "No model guarantees income; choose based on your situation and measure your results.",
  ],
};
