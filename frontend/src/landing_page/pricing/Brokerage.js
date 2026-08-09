import React from "react";

const chargeGroups = [
  [
    {
      title: "Securities/Commodities transaction tax",
      paragraphs: [
        "Tax charged by the government when transacting on the exchanges. It applies on both buy and sell sides for equity delivery, and only on the selling side for intraday and F&O trades.",
        "STT/CTT can be higher than the brokerage charged, so it is important to keep track of it.",
      ],
    },
    {
      title: "Transaction/Turnover charges",
      paragraphs: [
        "Charged by exchanges (NSE, BSE, MCX) on the value of your transactions.",
        "BSE transaction charges vary by security group and may be revised by the exchange.",
      ],
    },
    {
      title: "Call & trade",
      paragraphs: ["Additional charges of ₹50 per order apply to orders placed through a dealer, including auto square-off orders."],
    },
    {
      title: "Stamp charges",
      paragraphs: ["Charged by the Government of India under the Indian Stamp Act of 1899 for transactions in instruments on stock exchanges and depositories."],
    },
  ],
  [
    {
      title: "NRI brokerage charges",
      paragraphs: [
        "For a non-PIS account, brokerage is 0.5% or ₹50 per executed equity and F&O order, whichever is lower.",
        "For a PIS account, brokerage is 0.5% or ₹200 per executed equity order, whichever is lower. Yearly account maintenance charges are ₹500 plus GST.",
      ],
    },
    {
      title: "Account with debit balance",
      paragraphs: ["If an account has a debit balance, each executed order is charged ₹40 instead of ₹20."],
    },
    {
      title: "Investor Protection Fund Trust charges",
      paragraphs: [
        "NSE IPFT charges apply to equity, futures, options, and currency trades at the exchange's prescribed rates, plus GST.",
      ],
    },
    {
      title: "Margin Trading Facility (MTF)",
      paragraphs: [
        "MTF interest is 0.04% per day (₹40 per lakh) on the funded amount, from T+1 until the stocks are sold.",
        "MTF brokerage is 0.3% or ₹20 per executed order, whichever is lower. Pledge and unpledge requests cost ₹15 plus GST per ISIN.",
      ],
    },
  ],
];

function Brokerage() {
  return (
    <section className="container mb-5">
      <div className="row text-center mb-5">
        <h4>
          <a
            href="https://zerodha.com/brokerage-calculator"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none", fontWeight: 400 }}
          >
            Calculate your costs upfront
          </a>{" "}
          using our brokerage calculator
        </h4>
      </div>

      <h3 className="mb-4">Charges explained</h3>
      <div className="row">
        {chargeGroups.map((group, index) => (
          <div className="col-md-6" key={index}>
            {group.map(({ title, paragraphs }) => (
              <article className="mb-4" key={title}>
                <h5>{title}</h5>
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Brokerage;
