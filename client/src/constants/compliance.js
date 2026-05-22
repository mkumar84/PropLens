// All disclaimer strings — never write disclaimer text inline, always import from here

export const BROKERAGE_NAME = '[BROKERAGE NAME]'; // TODO: MAHESH TO PROVIDE
export const BROKERAGE_ADDRESS = '[BROKERAGE ADDRESS]'; // TODO: MAHESH TO PROVIDE
export const BROKERAGE_LOGO = '/images/brokerage-logo.png'; // TODO: MAHESH TO PROVIDE
export const RECO_REG = '[RECO REG #]'; // TODO: MAHESH TO PROVIDE
export const PREC_NAME = '[PREC NAME]'; // TODO: MAHESH TO PROVIDE
export const CONTACT_EMAIL = 'mahesh@propertylens.ca'; // TODO: MAHESH TO PROVIDE
export const AGENT_NAME = 'Mahesh Kumar';
export const CURRENT_YEAR = new Date().getFullYear();

export const DISCLAIMERS = {
  'ai-estimate': 'AI estimate · not a certified appraisal',

  'cma': `This CMA is prepared by ${AGENT_NAME}, Salesperson, ${BROKERAGE_NAME}, and is for informational purposes only. It is not a certified appraisal under CUSPAP standards and should not be relied upon as such.`,

  'mortgage': 'This calculator is for illustrative purposes only and does not constitute financial or mortgage advice. Results are estimates based on inputs provided. Consult a licensed mortgage professional before making any financial decisions.',

  'investment': 'Investment projections are estimates based on current market data and assumed variables. They are not guarantees of future performance. Consult a licensed financial advisor before making investment decisions.',

  'mls-data': `Listing data © ${CURRENT_YEAR} The Canadian Real Estate Association (CREA) and the Toronto Regional Real Estate Board (TRREB). All rights reserved. The trademarks MLS®, REALTOR®, and the associated logos are owned by CREA.`,

  'solicitation': 'Not intended to solicit buyers or sellers currently under contract with a real estate brokerage.',

  'open-house': 'Checklist is AI-generated for informational purposes only. Always retain a licensed home inspector before purchasing.',

  'chat-bar': `PropertyLens is operated by ${AGENT_NAME}, Salesperson, ${BROKERAGE_NAME}, RECO Reg. #${RECO_REG}`,

  'lead-modal': `Your information is collected by ${AGENT_NAME}, Salesperson, ${BROKERAGE_NAME}, RECO Reg. #${RECO_REG} and will be used to respond to your inquiry.`,
};

export const FOOTER_LINES = [
  `${AGENT_NAME}, Salesperson | ${BROKERAGE_NAME}`,
  `RECO Registration #${RECO_REG}`,
  DISCLAIMERS['solicitation'],
  'AI-generated insights are estimates only and do not constitute professional real estate, financial, or legal advice.',
];
