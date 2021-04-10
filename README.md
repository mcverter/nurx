Here is my solution to the take-home assignment to implement the Router for prescriptions.

The UML diagram can be mapped directly onto an ORM -- that is, both a database schema and an Object that models that schema. Because I mostly program in Javascript these days and JS is a weakly-typed language, I chose to use Typescript to enforce type/class relations. Once I had mapped the UML into a set of Typescript interfaces and classes, the function implementations were very easy to write.

I wrote a set of rudimentary tests just to check if the code ran as expected, and to test a number of edge cases. I am still trying to formulate more thorough tests. I did not use any testing library for this, but just wrote employed a simple Object Equality test to make sure that the value returned by the function corresponded to the expected value.

> Please comment your implementation and make note of assumptions, trade-offs, and limitations in the architecture, as well as any exceptions that the fulfillment assignment algorithm must consider.

There were a number of edge cases that could occur, which I am still testing -- obvious stuff like what if the order was empty or a pharmacy was empty.

The most serious edge condition that could occur would be if no pharmacy had a certain medication and therefore the Order could not be fulfilled at all. I am just returning "null" in this case but there could be other ways to mitigate this problem.

The most serious assumption was that every pharmacy has unlimited supply of each medication. An OrderItem is defined by its {drug, quantity}. If each pharmacy has an unlimited supply of this drug, the "quantity" property isn't very interesting for the test of this workflow. The warning in the Specification "a single OrderItem cannot be split across more than one pharmacy" doesn't even make sense because the only reason one would want to do this if one pharmacy had run out of the medication and so there would be no reason to go to another.

# Problems with my code

- My code doesn't optimize for reducing the numbers of pharmacies.  
  Each pharmacy is checked iteratively for the price of the given medication and the pharmacy with the lowest cost of the medication. But what if two pharmacies, PharmacyA and PharmacyB, have the same price for Medication1? If PharmacyA is first in the array of pharmacies, then the OrderItem will be fulfilled by PharmacyA. But what if PharmacyB is the best place to buy Medication2 and the rest of the OrderItems. It would make more sense to order everything from PharmacyB. My program does not optimize for that.

- Shipping cost.  
  As a corollary of the above, we aren't even considering the various shipping costs from each pharmacy. This data point would drastically affect our calculation of best cost.

# Improvements

I stuck closely to the UML diagram and did not introduce any additional entities or functionalities or state variables.

That said, there are several ways to improve performance by adding to the specification.

- Pharmacy uses Array.find() to get InventoryItem
  Pharmacy has an Array of InventoryItems and therefore has to call Array.find() to check whether it has a certain drug

It would be easier if we could build a mapping of drug name to InventoryItem. I did not know whether adding it would be acceptable to add this additional storage to the PharmacyObject

- Router Looping over pharmacies

  For each medication, we have to loop over each pharmacy to check for the lowest cost. This is an incredibly wasteful procedure. It would be much better if, for each possible medication, we could develop an index of pharmacies, ordered by price for that medication. In fact, we would only need to store the first value of such an index. Given that each pharmacy has unlimited supply we know that, for example, PharmacyA is always the best place to buy aspirin and PharmacyB is always the best place to buy tylenol.

Similarly, it might be useful to aggregate all of the drugs of a given type together -- fulfill all the tylenol orders together, then all the aspirin orders together, and so forth.
