export interface Product {
    theme: "light" | "dark";
    productUrl: string ;
    allowSelectTemperature: boolean;
    accountUsageLink?: string ;
    importantNote: string;
    description: string;
    welcomeMessage: string;
    name: string;
    image: string;
    showSystemPrompt: boolean;
  }

  