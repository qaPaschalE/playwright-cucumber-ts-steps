import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

// Supports optional parameters
type FakerMapping = Record<string, ((param?: string) => string) | (() => string)>;

const fakerMapping: FakerMapping = {
  "First Name": () => faker.person.middleName(),
  Name: () => faker.person.middleName(),
  "Last Name": () => faker.person.middleName(),
  Email: () => faker.internet.email(),
  "Phone Number": () => faker.string.numeric(10),
  Number: () => faker.string.numeric(11),
  "Complete Number": () => faker.string.numeric(11),
  "App Colour": () => faker.color.rgb(),
  "App Name": () => faker.commerce.productName(),
  "Role Name": () => faker.person.jobTitle(),
  "Company Name": () => faker.company.name(),
  "Full Name": () => faker.person.fullName(),
  "Disposable Email": () => faker.internet.email({ provider: "inboxkitten.com" }),
  "ALpha Numeric": () => faker.string.numeric(11) + "e",
  "Lorem Word": () => faker.lorem.sentences({ min: 1, max: 3 }),
  Word: () => faker.lorem.word({ length: { min: 5, max: 11 } }),
  "Current Date": () => dayjs().format("YYYY-MM-DD"),
  "Current Date2": () => new Date().toISOString().split("T")[0],

  MonthsFromNow: (months?: string) => {
    const monthsToAdd = parseInt(months || "0", 10);
    return dayjs().add(monthsToAdd, "month").format("YYYY-MM-DD");
  },
  MonthsAgo: (months?: string) => {
    const monthsToSubtract = parseInt(months || "0", 10);
    return dayjs().subtract(monthsToSubtract, "month").format("YYYY-MM-DD");
  },

  WeeksFromNow: (weeks?: string) => {
    const weeksToAdd = parseInt(weeks || "0", 10);
    return dayjs().add(weeksToAdd, "week").format("YYYY-MM-DD");
  },
  WeeksAgo: (weeks?: string) => {
    const weeksToSubtract = parseInt(weeks || "0", 10);
    return dayjs().subtract(weeksToSubtract, "week").format("YYYY-MM-DD");
  },

  DaysFromNow: (days?: string) => {
    const daysToAdd = parseInt(days || "0", 10);
    return dayjs().add(daysToAdd, "day").format("YYYY-MM-DD");
  },
  DaysAgo: (days?: string) => {
    const daysToSubtract = parseInt(days || "0", 10);
    return dayjs().subtract(daysToSubtract, "day").format("YYYY-MM-DD");
  },
};

export function evaluateFaker(value: string): string {
  const [key, param] = value.split(":");

  const fn = fakerMapping[key];
  if (typeof fn === "function") {
    return fn(param);
  }

  return value; // fallback to raw value if not mapped
}
