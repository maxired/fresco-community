import { parseGameFromCsv } from "./parseGameFromCsv";
import { GameDefinition } from "./types";

const data = `SECTION,,,,,,,,,,,,,,,,,,,
main,gameName,deathMessage,victoryMessage,roundName,assetsUrl,,,,,,,,,,,,,,,
,A month in the life of a data officer,You have been fired!,You won!,Day,games,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
stats,name,icon,value,,,,,,,,,,,,,,,,
,Profit,noun-coins-1123601.svg,50,,,,,,,,,,,,,,,,
,Customer satisfaction,noun-crowd-2383331.svg,37,,,,,,,,,,,,,,,,
,Security,noun-shield-4865890.svg,5,,,,,,,,,,,,,,,,
,Team well-being,noun-team-4854330.svg,78,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,
cards,card,id,bearer,conditions,churn,weight,override_yes,answer_yes,yes_stat1,yes_stat2,yes_stat3,yes_stat4,yes_custom,answer_no,no_stat1,no_stat2,no_stat3,no_stat4,no_custom
,"Data officer, we want to test a new product. Is it ok to ignore GDPR practices for now?",card-1,entrepreneur,,2,10,,Yes but keep me in the loop,5,5,-10,0,,Absolutely not!,-5,-5,0,42,
,One of our clients is asking to get his data deleted,card-2,customer-support,,2,1,,,10,-5,10,0,,,-10,0,-10,,
,"Our database queries are getting slower, we should do something about our old data",card-3,developer,,2,1,,Delete data from inactive users,0,0,10,0,,Extract the data and archive it,-5,0,-10,,
,A potential acquirer is asking for the content of our data.,card-4,customer-support,,2,1,,"Of course, this could be a great opportunity for us",-10,0,-10,0,0,Hell no!,0,-5,0,,
,We have been breached. The password hashes of our users have been published online!,card-5,developer,,2,1,,Send an apology to our users and explain we are going to enforce Multi Factor authentication.,5,-10,-5,0,,Sshhh... Let's hope the news doesn't spread,-5,-5,-5,,cheated=true
,A security consultant has (unsolicitedly) reported a new vulnerability.,card-6,customer-support,,2,100,,Pay this person a bounty and fix the bug asap,0,-5,10,0,,Ignore this person. These guys are vultures.,-5,0,-10,,
,Our users complain it is too hard to cancel our subscription,card-7,customer-support,,2,1,,"It is by design, so that we can make them change their mind.",-5,10,-5,0,,Add a new button to start the cancelation process,5,0,10,,
,"The EU commission is not happy, they found out about your little data breach...",card-8,entrepreneur,cheated==true stat3<20,2,80,,Damn...,-10,0,-10,0,,Oopsie...,-10,0,-10,,cheated=false`;

describe("parseGameFromCsv", () => {
  it("should parse cards from string", () => {
    const { cards } = parseGameFromCsv(data) || { cards: [] };
    expect(cards.length).toBe(8);

    expect(cards[0].card).toBe(
      "Data officer, we want to test a new product. Is it ok to ignore GDPR practices for now?"
    );
    expect(cards[0]["no_stat4"]).toBe(42);

    expect(cards[7].card).toBe(
      "The EU commission is not happy, they found out about your little data breach..."
    );
    expect(cards[7]["no_stat4"]).toBe(null);
    expect(cards[7]["no_custom"]).toBe("cheated=false");
  });

  it("should parse stats from string", () => {
    const { stats } = parseGameFromCsv(data) || { stats: [] };
    expect(stats.length).toBe(4);

    expect(stats[0].name).toBe("Profit");
    expect(stats[0].icon).toBe("noun-coins-1123601.svg");
    expect(stats[0].value).toBe(50);

    expect(stats[1].name).toBe("Customer satisfaction");
    expect(stats[1].icon).toBe("noun-crowd-2383331.svg");
    expect(stats[1].value).toBe(37);

    expect(stats[2].name).toBe("Security");
    expect(stats[2].icon).toBe("noun-shield-4865890.svg");
    expect(stats[2].value).toBe(5);

    expect(stats[3].name).toBe("Team well-being");
    expect(stats[3].icon).toBe("noun-team-4854330.svg");
    expect(stats[3].value).toBe(78);
  });

  it("should parse main section from string", () => {
    const { gameName, deathMessage, victoryMessage, roundName, assetsUrl } = parseGameFromCsv(
      data
    ) as GameDefinition;

    expect(gameName).toBe("A month in the life of a data officer");
    expect(deathMessage).toBe("You have been fired!");
    expect(victoryMessage).toBe("You won!");

    expect(roundName).toBe("Day");
    expect(assetsUrl).toBe("games");
  });
});
