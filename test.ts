import { Order, Assignment, Pharmacy, Router } from "./OrdersAPI";

const maryOrder: Order = {
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

const francescaOrder: Order = {
  items: [
    {
      drug: "aspirin",
      quantity: 5,
    },
    {
      drug: "tylenol",
      quantity: 2,
    },
  ],
};

const willheminaOrder: Order = {
  items: [
    {
      drug: "aspirin",
      quantity: 5,
    },
    {
      drug: "tylenol",
      quantity: 2,
    },
  ],
};

const averagePricesPharmacy: Pharmacy = new Pharmacy("red", [
  { drug: "aspirin", cost: 10 },
  { drug: "tylenol", cost: 10 },
  { drug: "advil", cost: 10 },
]);

const expensiveTylenolEverythingElseCheapPharmacy: Pharmacy = new Pharmacy(
  "blue",
  [
    { drug: "aspirin", cost: 5 },
    { drug: "tylenol", cost: 50 },
    { drug: "advil", cost: 5 },
  ]
);
const cheapAspirinEverythingElseExpensivePharmacy: Pharmacy = new Pharmacy(
  "blue",
  [
    { drug: "aspirin", cost: 20 },
    { drug: "tylenol", cost: 20 },
    { drug: "advil", cost: 1 },
  ]
);

const router: Router = new Router([
  averagePricesPharmacy,
  expensiveTylenolEverythingElseCheapPharmacy,
]);

const maryExpected: Array<Assignment> = [
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

console.log(
  JSON.stringify(maryExpected) === JSON.stringify(router.assign(maryOrder))
);

/*
function printAssignmentArray(assigments: Array<Assignment>): void {
  assigments.forEach((a) => console.log(a.pharmacy.name, a.items));
}
*/
