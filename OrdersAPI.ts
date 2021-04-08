interface Order {
  items: Array<OrderItem>;
}
interface OrderItem {
  drug: string;
  quantity: number;
}
interface Assignment {
  items: Array<OrderItem>;
  pharmacy: Pharmacy;
}
interface InventoryItem {
  drug: string;
  cost: number;
}
class Pharmacy {
  name: string;
  inventory: Array<InventoryItem>;

  constructor(name: string, inventory: Array<InventoryItem>) {
    this.name = name;
    this.inventory = inventory;
  }

  /* This will return -1 if the item is not found.  
  Otherwise, will return (cost * quantity) 
  I am making a huge assumption here that each pharmacy has unlimited supply of each item */
  estimateOrderItemCost = (orderItem: OrderItem): number => {
    const inventory: InventoryItem = this.inventory.find(
      (i) => i.drug === orderItem.drug
    );
    debugger;
    if (!inventory) {
      return -1;
    }
    return inventory.cost * orderItem.quantity;
  };
}

class Router {
  pharmacies: Array<Pharmacy>;

  /* In case no pharmacy has the OrderItem, so this will return null 
     Otherwise this will return the pharmacy with the lowest cost pharmacy
  */

  constructor(pharmacies: Array<Pharmacy>) {
    this.pharmacies = pharmacies;
  }

  findLowestCostPharmacy = (item: OrderItem): Pharmacy => {
    let lowestCost = Number.MAX_VALUE;
    let lowestPharmacy = null;
    for (let i = 0; i < this.pharmacies.length; i++) {
      const pharmacy = this.pharmacies[i];
      const cost = pharmacy.estimateOrderItemCost(item);
      if (cost > -1 && cost < lowestCost) {
        lowestPharmacy = pharmacy;
        lowestCost = cost;
      }
    }
    return lowestPharmacy;
  };

  /* This iterates through the OrderItems in the Order 
    If any of the OrderItems can not be fulfilled, it will return null,
    Otherwise it returns an array of Assignments
  */
  assign = (order: Order): Array<Assignment> => {
    const assignments = {};
    const { items } = order;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const pharmacy: Pharmacy = this.findLowestCostPharmacy(item);
      if (!pharmacy) {
        return null;
      } else if (assignments[pharmacy.name]) {
        assignments[pharmacy.name].items.push(item);
      } else {
        assignments[pharmacy.name] = { pharmacy, items: [item] };
      }
    }
    return Object.keys(assignments).map((k) => assignments[k]);
  };
}

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

const redPharmacy: Pharmacy = new Pharmacy("red", [
  { drug: "aspirin", cost: 10 },
  { drug: "tylenol", cost: 10 },
  { drug: "advil", cost: 10 },
]);

const bluePharmacy: Pharmacy = new Pharmacy("blue", [
  { drug: "aspirin", cost: 5 },
  { drug: "tylenol", cost: 50 },
  { drug: "advil", cost: 1 },
]);

const router: Router = new Router([redPharmacy, bluePharmacy]);

function printAssignmentArray(assigments: Array<Assignment>):void {
  assigments.forEach(a=>console.log(a.pharmacy.name, a.items))
}
printAssignmentArray(router.assign(maryOrder));
