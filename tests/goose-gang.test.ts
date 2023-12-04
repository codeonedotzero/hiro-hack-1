import { initSimnet } from '@hirosystems/clarinet-sdk';
const simnet = await initSimnet();
import { Cl, trueCV } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';


const accounts = simnet.getAccounts();
const goose1 = accounts.get("wallet_1")!;
const goose2 = accounts.get("wallet_2")!;
const goose3 = accounts.get("wallet_3")!;

describe('test `get-fresh-egg-price` ', () => {
  it('fetches the initial cost of 100 eggs', () => {
    const buyPrice = simnet.callReadOnlyFn('goose-gang', 'get-fresh-egg-price', [Cl.standardPrincipal(goose1), Cl.uint(100)], goose1);
    console.log(Cl.prettyPrint(buyPrice.result)); // (ok 10010)
    //expect(buyPrice.result["value"]).toContain(Cl.uint(10010));
  });
});

describe('test `create-goose-gang` ', () => {
  it('attempts to create a goose 1 gang, initial supply 100', () => {
    const buyInitialKeys = simnet.callPublicFn('goose-gang', 'create-goose-gang', [
      Cl.standardPrincipal(goose1), 
      Cl.stringAscii("Goose 1"),
      Cl.stringAscii("66ca7cc6f089e1bcd2135b55476376f4f62f012bb26997e11626ab2e4562ea81i0"),
      Cl.uint(100)
    ], goose1);
    
    for (let i = 0; i < buyInitialKeys.events.length; i++) {
      console.log(buyInitialKeys.events[i]);
    }

    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok true)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.bool(true));
  });
});

describe('test `get-fresh-egg-price` ', () => {
  it('fetches the price of a supply of 25 goose 1 eggs', () => {
    const incrementResponse = simnet.callReadOnlyFn('goose-gang', 'get-fresh-egg-price', [Cl.standardPrincipal(goose1), Cl.uint(25)], goose1);
    console.log(Cl.prettyPrint(incrementResponse.result)); // (ok 3910)
    //expect(incrementResponse.result["value"]).toContain(Cl.uint(3910));
  });
});

describe('test `get-egg-balance` ', () => {
  it('fetch the balance of goose 1 eggs held by goose 1', () => {
    const incrementResponse = simnet.callReadOnlyFn('goose-gang', 'get-egg-balance', [Cl.standardPrincipal(goose1), Cl.standardPrincipal(goose1)], goose1);
    console.log(Cl.prettyPrint(incrementResponse.result)); // (ok 100)
    expect(incrementResponse.result["value"]).toStrictEqual(Cl.uint(100));
  });
});

describe('test `get-egg-balance` ', () => {
  it('fetch the balance of goose 1 eggs held by goose 2', () => {
    const incrementResponse = simnet.callReadOnlyFn('goose-gang', 'get-egg-balance', [Cl.standardPrincipal(goose1), Cl.standardPrincipal(goose2)], goose1);
    console.log(Cl.prettyPrint(incrementResponse.result)); // (ok 0)
    expect(incrementResponse.result["value"]).toStrictEqual(Cl.uint(0));
  });
});

describe('test `get-egg-supply` ', () => {
  it('fetches the supply of eggs for goose 1', () => {
    const buyInitialKeys = simnet.callReadOnlyFn('goose-gang', 'get-egg-supply', [Cl.standardPrincipal(goose1)], goose1);
    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok 100)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.uint(100));
  });
});

describe('test `create-goose-gang` ', () => {
  it('attempts to create a goose 2 gang, initial supply 50', () => {
    const buyInitialKeys = simnet.callPublicFn('goose-gang', 'create-goose-gang', [
      Cl.standardPrincipal(goose2), 
      Cl.stringAscii("Goose 2"),
      Cl.stringAscii("1a725f4dbb9bbc844d915b074ba43412b308d388915e18c9b2e5755e2a7fecd2i0"),
      Cl.uint(100)
    ], goose2);
    
    for (let i = 0; i < buyInitialKeys.events.length; i++) {
      console.log(buyInitialKeys.events[i]);
    }

    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok true)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.bool(true));
  });
});

describe('test `lay-eggs` ', () => {
  it('attempts to lay 25 goose 1 eggs for goose 2', () => {
    const buyInitialKeys = simnet.callPublicFn('goose-gang', 'lay-eggs', [Cl.standardPrincipal(goose1), Cl.uint(25)], goose2);
    
    for (let i = 0; i < buyInitialKeys.events.length; i++) {
      console.log(buyInitialKeys.events[i]);
    }

    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok true)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.bool(true));
  });
});

describe('test `get-egg-balance` ', () => {
  it('fetch the balance of goose 1 eggs held by goose 1', () => {
    const incrementResponse = simnet.callReadOnlyFn('goose-gang', 'get-egg-balance', [Cl.standardPrincipal(goose1), Cl.standardPrincipal(goose1)], goose1);
    console.log(Cl.prettyPrint(incrementResponse.result)); // (ok 100)
    expect(incrementResponse.result["value"]).toStrictEqual(Cl.uint(100));
  });
});

describe('test `get-egg-balance` ', () => {
  it('fetch the balance of goose 1 eggs held by goose 2', () => {
    const incrementResponse = simnet.callReadOnlyFn('goose-gang', 'get-egg-balance', [Cl.standardPrincipal(goose1), Cl.standardPrincipal(goose2)], goose1);
    console.log(Cl.prettyPrint(incrementResponse.result)); // (ok 25)
    expect(incrementResponse.result["value"]).toStrictEqual(Cl.uint(25));
  });
});

describe('test `get-egg-supply` ', () => {
  it('fetches the supply of eggs for goose 1', () => {
    const buyInitialKeys = simnet.callReadOnlyFn('goose-gang', 'get-egg-supply', [Cl.standardPrincipal(goose1)], goose1);
    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok 125)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.uint(125));
  });
});

describe('test `break-eggs` ', () => {
  it('attempts to break 50 goose 1 egs to claim the rewards', () => {
    const buyInitialKeys = simnet.callPublicFn('goose-gang', 'break-eggs', [Cl.standardPrincipal(goose1), Cl.uint(5)], goose1);
    
    for (let i = 0; i < buyInitialKeys.events.length; i++) {
      console.log(buyInitialKeys.events[i]);
    }

    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok true)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.bool(true));
  });
});

describe('test `get-egg-balance` ', () => {
  it('fetch the balance of goose 1 eggs held by goose 1', () => {
    const incrementResponse = simnet.callReadOnlyFn('goose-gang', 'get-egg-balance', [Cl.standardPrincipal(goose1), Cl.standardPrincipal(goose1)], goose1);
    console.log(Cl.prettyPrint(incrementResponse.result)); // (ok 95)
    expect(incrementResponse.result["value"]).toStrictEqual(Cl.uint(95));
  });
});

describe('test `get-egg-balance` ', () => {
  it('fetch the balance of goose 1 eggs held by goose 2', () => {
    const incrementResponse = simnet.callReadOnlyFn('goose-gang', 'get-egg-balance', [Cl.standardPrincipal(goose1), Cl.standardPrincipal(goose2)], goose1);
    console.log(Cl.prettyPrint(incrementResponse.result)); // (ok 25)
    expect(incrementResponse.result["value"]).toStrictEqual(Cl.uint(25));
  });
});

describe('test `get-egg-supply` ', () => {
  it('fetches the supply of eggs for goose 1', () => {
    const buyInitialKeys = simnet.callReadOnlyFn('goose-gang', 'get-egg-supply', [Cl.standardPrincipal(goose1)], goose1);
    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok 120)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.uint(120));
  });
});

describe('test `get-egg-supply` ', () => {
  it('fetches the supply of eggs for goose 2', () => {
    const buyInitialKeys = simnet.callReadOnlyFn('goose-gang', 'get-egg-supply', [Cl.standardPrincipal(goose2)], goose2);
    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok 100)
    expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.uint(100));
  });
});

describe('test `get-goose` ', () => {
  it('fetches the properties for goose 1', () => {
    const buyInitialKeys = simnet.callReadOnlyFn('goose-gang', 'get-goose', [Cl.standardPrincipal(goose1)], goose1);
    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok 120)
    //expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.uint(120));
  });
});

describe('test `get-goose` ', () => {
  it('fetches the properties for goose 2', () => {
    const buyInitialKeys = simnet.callReadOnlyFn('goose-gang', 'get-goose', [Cl.standardPrincipal(goose2)], goose1);
    console.log(Cl.prettyPrint(buyInitialKeys.result)); // (ok 120)
    //expect(buyInitialKeys.result["value"]).toStrictEqual(Cl.uint(120));
  });
});