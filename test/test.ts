import { Order, Assignment, Pharmacy, Router } from "../src/OrdersAPI";

const normalOrder: Order = {
  items: [
    {
      drug: "aspirin",
      quantity: 5,
    },
    {
      drug: "tylenol",
      quantity: 2,
    },
    {
      drug: "advil",
      quantity: 16,
    },
  ],
};
const emptyOrder: Order = {
  items: [],
};
const itemNotInPharmacyOrder: Order = {
  items: [
    {
      drug: "aspirin",
      quantity: 5,
    },
    {
      drug: "paracetemol",
      quantity: 2,
    },
  ],
};

const averagePricesPharmacy: Pharmacy = new Pharmacy("averagePrices", [
  { drug: "aspirin", cost: 10 },
  { drug: "tylenol", cost: 10 },
  { drug: "advil", cost: 10 },
]);
const expensiveTylenolEverythingElseCheapPharmacy: Pharmacy = new Pharmacy(
  "expensiveTylenolEverythingElseCheap",
  [
    { drug: "aspirin", cost: 5 },
    { drug: "tylenol", cost: 50 },
    { drug: "advil", cost: 5 },
  ]
);
const cheapAdvilEverythingElseExpensivePharmacy: Pharmacy = new Pharmacy(
  "cheapAdvilEverythingElseExpensive",
  [
    { drug: "aspirin", cost: 20 },
    { drug: "tylenol", cost: 20 },
    { drug: "advil", cost: 1 },
  ]
);

describe("Router", () => {
  it("should not pick the most expensive pharmacy", () => {
    const router: Router = new Router([
      averagePricesPharmacy,
      expensiveTylenolEverythingElseCheapPharmacy,
    ]);

    const expected: Array<Assignment> = [
      {
        pharmacy: expensiveTylenolEverythingElseCheapPharmacy,
        items: [
          { drug: "aspirin", quantity: 5 },
          { drug: "advil", quantity: 16 },
        ],
      },
      {
        pharmacy: averagePricesPharmacy,
        items: [{ drug: "tylenol", quantity: 2 }],
      },
    ];

    expect(router.assign(normalOrder)).toEqual(expected);
  });

  it("should  pick the cheapest pharmacy", () => {
    const router: Router = new Router([
      averagePricesPharmacy,
      cheapAdvilEverythingElseExpensivePharmacy,
    ]);

    const expected: Array<Assignment> = [
      {
        pharmacy: averagePricesPharmacy,
        items: [
          { drug: "aspirin", quantity: 5 },
          { drug: "tylenol", quantity: 2 },
        ],
      },
      {
        pharmacy: cheapAdvilEverythingElseExpensivePharmacy,
        items: [{ drug: "advil", quantity: 16 }],
      },
    ];

    expect(router.assign(normalOrder)).toEqual(expected);
  });

  it("will return an empty array for an empty order", () => {
    const router: Router = new Router([
      averagePricesPharmacy,
      expensiveTylenolEverythingElseCheapPharmacy,
      cheapAdvilEverythingElseExpensivePharmacy,
    ]);
    expect(router.assign(emptyOrder)).toEqual([]);
  });

  it("will return null if no pharmacies are provided", () => {
    const router: Router = new Router([]);
    expect(router.assign(normalOrder)).toEqual(null);
  });

  it("will return null if no pharmacies have one of the items", () => {
    const router: Router = new Router([
      averagePricesPharmacy,
      expensiveTylenolEverythingElseCheapPharmacy,
      cheapAdvilEverythingElseExpensivePharmacy,
    ]);
    expect(router.assign(itemNotInPharmacyOrder)).toEqual(null);
  });
});
