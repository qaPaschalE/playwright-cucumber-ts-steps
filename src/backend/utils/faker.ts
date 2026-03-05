//src/backend/utils/faker.ts
import { faker } from '@faker-js/faker';
import { Step } from "../../core/registry";
import { setVariable, getVariable } from "./state";

// ==================================================
// HELPER FUNCTIONS
// ==================================================

/**
 * Stores a generated value in the page state and logs it.
 * @param page - The Playwright page object
 * @param alias - The alias to store the value under
 * @param value - The generated value
 * @param label - A descriptive label for logging
 */
function storeGeneratedValue(page: any, alias: string, value: string, label: string): void {
    setVariable(page, alias, value);
    console.log(`🎭 Generated ${label}: "${value}" (stored as @${alias})`);
}

// ==================================================
// NAME GENERATORS
// ==================================================

/**
 * Generates a random first name.
 * @example When I pw generate first name as "firstName"
 */
Step("I pw generate first name as {string}", async (page: any, alias: string) => {
    const value = faker.person.firstName();
    storeGeneratedValue(page, alias, value, "first name");
});

/**
 * Generates a random last name.
 * @example When I pw generate last name as "lastName"
 */
Step("I pw generate last name as {string}", async (page: any, alias: string) => {
    const value = faker.person.lastName();
    storeGeneratedValue(page, alias, value, "last name");
});

/**
 * Generates a random full name.
 * @example When I pw generate full name as "fullName"
 */
Step("I pw generate full name as {string}", async (page: any, alias: string) => {
    const value = faker.person.fullName();
    storeGeneratedValue(page, alias, value, "full name");
});

/**
 * Generates a random job title.
 * @example When I pw generate job title as "jobTitle"
 */
Step("I pw generate job title as {string}", async (page: any, alias: string) => {
    const value = faker.person.jobTitle();
    storeGeneratedValue(page, alias, value, "job title");
});

// ==================================================
// TEXT GENERATORS
// ==================================================

/**
 * Generates a random word.
 * @example When I pw generate word as "word"
 */
Step("I pw generate word as {string}", async (page: any, alias: string) => {
    const value = faker.lorem.word();
    storeGeneratedValue(page, alias, value, "word");
});

/**
 * Generates random words (default: 3).
 * @example When I pw generate {int} words as "words"
 */
Step("I pw generate {int} words as {string}", async (page: any, count: number, alias: string) => {
    const value = faker.lorem.words(count);
    storeGeneratedValue(page, alias, value, `${count} words`);
});

/**
 * Generates a random sentence.
 * @example When I pw generate sentence as "sentence"
 */
Step("I pw generate sentence as {string}", async (page: any, alias: string) => {
    const value = faker.lorem.sentence();
    storeGeneratedValue(page, alias, value, "sentence");
});

/**
 * Generates random sentences (default: 2).
 * @example When I pw generate {int} sentences as "sentences"
 */
Step("I pw generate {int} sentences as {string}", async (page: any, count: number, alias: string) => {
    const value = faker.lorem.sentences(count);
    storeGeneratedValue(page, alias, value, `${count} sentences`);
});

/**
 * Generates a short paragraph (1-3 sentences).
 * @example When I pw generate short paragraph as "shortParagraph"
 */
Step("I pw generate short paragraph as {string}", async (page: any, alias: string) => {
    const value = faker.lorem.paragraph({ min: 1, max: 3 });
    storeGeneratedValue(page, alias, value, "short paragraph");
});

/**
 * Generates a long paragraph (5-10 sentences).
 * @example When I pw generate long paragraph as "longParagraph"
 */
Step("I pw generate long paragraph as {string}", async (page: any, alias: string) => {
    const value = faker.lorem.paragraph({ min: 5, max: 10 });
    storeGeneratedValue(page, alias, value, "long paragraph");
});

/**
 * Generates multiple paragraphs.
 * @example When I pw generate {int} paragraphs as "paragraphs"
 */
Step("I pw generate {int} paragraphs as {string}", async (page: any, count: number, alias: string) => {
    const value = faker.lorem.paragraphs(count, '\n\n');
    storeGeneratedValue(page, alias, value, `${count} paragraphs`);
});

/**
 * Generates random text (lorem ipsum) with specified length in characters.
 * @example When I pw generate text with {int} characters as "loremText"
 */
Step("I pw generate text with {int} characters as {string}", async (page: any, length: number, alias: string) => {
    let value = '';
    while (value.length < length) {
        value += faker.lorem.word() + ' ';
    }
    value = value.trim().substring(0, length);
    // Ensure exact length by padding if needed
    while (value.length < length) {
        value += 'x';
    }
    storeGeneratedValue(page, alias, value, `text (${length} chars)`);
});

// ==================================================
// NUMBER GENERATORS
// ==================================================

/**
 * Generates a random number.
 * @example When I pw generate number as "number"
 */
Step("I pw generate number as {string}", async (page: any, alias: string) => {
    const value = faker.number.int({ min: 0, max: 999999 }).toString();
    storeGeneratedValue(page, alias, value, "number");
});

/**
 * Generates a random number between min and max.
 * @example When I pw generate number between {int} and {int} as "randomNumber"
 */
Step("I pw generate number between {int} and {int} as {string}", async (page: any, min: number, max: number, alias: string) => {
    const value = faker.number.int({ min, max }).toString();
    storeGeneratedValue(page, alias, value, `number (${min}-${max})`);
});

/**
 * Generates multiple random numbers.
 * @example When I pw generate {int} numbers as "randomNumbers"
 */
Step("I pw generate {int} numbers as {string}", async (page: any, count: number, alias: string) => {
    const numbers = [];
    for (let i = 0; i < count; i++) {
        numbers.push(faker.number.int({ min: 0, max: 999999 }));
    }
    const value = numbers.join(',');
    storeGeneratedValue(page, alias, value, `${count} numbers`);
});

/**
 * Generates a random digit (0-9).
 * @example When I pw generate digit as "digit"
 */
Step("I pw generate digit as {string}", async (page: any, alias: string) => {
    const value = faker.number.int({ min: 0, max: 9 }).toString();
    storeGeneratedValue(page, alias, value, "digit");
});

/**
 * Generates multiple random digits.
 * @example When I pw generate {int} digits as "digits"
 */
Step("I pw generate {int} digits as {string}", async (page: any, count: number, alias: string) => {
    let value = '';
    for (let i = 0; i < count; i++) {
        value += faker.number.int({ min: 0, max: 9 });
    }
    storeGeneratedValue(page, alias, value, `${count} digits`);
});

/**
 * Generates a random float/decimal number.
 * @example When I pw generate float as "floatNumber"
 */
Step("I pw generate float as {string}", async (page: any, alias: string) => {
    const value = faker.number.float({ min: 0, max: 100, fractionDigits: 2 }).toString();
    storeGeneratedValue(page, alias, value, "float");
});

// ==================================================
// STRING GENERATORS
// ==================================================

/**
 * Generates a random alphanumeric string.
 * @example When I pw generate alphanumeric as "alphanumeric"
 */
Step("I pw generate alphanumeric as {string}", async (page: any, alias: string) => {
    const value = faker.string.alphanumeric();
    storeGeneratedValue(page, alias, value, "alphanumeric");
});

/**
 * Generates an alphanumeric string of specified length.
 * @example When I pw generate alphanumeric with {int} characters as "alphanumeric10"
 */
Step("I pw generate alphanumeric with {int} characters as {string}", async (page: any, length: number, alias: string) => {
    const value = faker.string.alphanumeric({ length });
    storeGeneratedValue(page, alias, value, `alphanumeric (${length} chars)`);
});

/**
 * Generates a random alphabetic string (letters only).
 * @example When I pw generate alpha as "alpha"
 */
Step("I pw generate alpha as {string}", async (page: any, alias: string) => {
    const value = faker.string.alpha();
    storeGeneratedValue(page, alias, value, "alpha");
});

/**
 * Generates an alphabetic string of specified length.
 * @example When I pw generate alpha with {int} characters as "alpha10"
 */
Step("I pw generate alpha with {int} characters as {string}", async (page: any, length: number, alias: string) => {
    const value = faker.string.alpha({ length });
    storeGeneratedValue(page, alias, value, `alpha (${length} chars)`);
});

/**
 * Generates a random numeric string (digits only).
 * @example When I pw generate numeric as "numeric"
 */
Step("I pw generate numeric as {string}", async (page: any, alias: string) => {
    const value = faker.string.numeric();
    storeGeneratedValue(page, alias, value, "numeric");
});

/**
 * Generates a numeric string of specified length.
 * @example When I pw generate numeric with {int} digits as "numeric10"
 */
Step("I pw generate numeric with {int} digits as {string}", async (page: any, length: number, alias: string) => {
    const value = faker.string.numeric({ length });
    storeGeneratedValue(page, alias, value, `numeric (${length} digits)`);
});

/**
 * Generates a random UUID.
 * @example When I pw generate uuid as "uuid"
 */
Step("I pw generate uuid as {string}", async (page: any, alias: string) => {
    const value = faker.string.uuid();
    storeGeneratedValue(page, alias, value, "UUID");
});

/**
 * Generates a random nanoid.
 * @example When I pw generate nanoid as "nanoid"
 */
Step("I pw generate nanoid as {string}", async (page: any, alias: string) => {
    const value = faker.string.nanoid();
    storeGeneratedValue(page, alias, value, "nanoid");
});

// ==================================================
// USER GENERATORS
// ==================================================

/**
 * Generates a random username.
 * @example When I pw generate username as "username"
 */
Step("I pw generate username as {string}", async (page: any, alias: string) => {
    const value = faker.internet.username();
    storeGeneratedValue(page, alias, value, "username");
});

/**
 * Generates a random email address.
 * @example When I pw generate email as "email"
 */
Step("I pw generate email as {string}", async (page: any, alias: string) => {
    const value = faker.internet.email();
    storeGeneratedValue(page, alias, value, "email");
});

/**
 * Generates a random password.
 * @example When I pw generate password as "password"
 */
Step("I pw generate password as {string}", async (page: any, alias: string) => {
    const value = faker.internet.password();
    storeGeneratedValue(page, alias, value, "password");
});

/**
 * Generates a password with specified length.
 * @example When I pw generate password with {int} characters as "password12"
 */
Step("I pw generate password with {int} characters as {string}", async (page: any, length: number, alias: string) => {
    const value = faker.internet.password({ length });
    storeGeneratedValue(page, alias, value, `password (${length} chars)`);
});

/**
 * Generates a random phone number.
 * @example When I pw generate phone number as "phoneNumber"
 */
Step("I pw generate phone number as {string}", async (page: any, alias: string) => {
    const value = faker.phone.number();
    storeGeneratedValue(page, alias, value, "phone number");
});

/**
 * Generates a phone number with country code and specified digit count.
 * @example When I pw generate country code "+1" with random 10 digits as "randomPhoneNumber"
 */
Step("I pw generate country code {string} with random {int} digits as {string}", async (page: any, countryCode: string, digitCount: number, alias: string) => {
    let phoneNumber = countryCode + ' ';
    for (let i = 0; i < digitCount; i++) {
        if (i > 0 && i % 3 === 0) {
            phoneNumber += '-';
        }
        phoneNumber += faker.number.int({ min: 0, max: 9 });
    }
    storeGeneratedValue(page, alias, phoneNumber, `phone number (${countryCode})`);
});

// ==================================================
// ADDRESS GENERATORS
// ==================================================

/**
 * Generates a random street address.
 * @example When I pw generate street address as "streetAddress"
 */
Step("I pw generate street address as {string}", async (page: any, alias: string) => {
    const value = faker.location.streetAddress();
    storeGeneratedValue(page, alias, value, "street address");
});

/**
 * Generates a random city name.
 * @example When I pw generate city as "city"
 */
Step("I pw generate city as {string}", async (page: any, alias: string) => {
    const value = faker.location.city();
    storeGeneratedValue(page, alias, value, "city");
});

/**
 * Generates a random state/province.
 * @example When I pw generate state as "state"
 */
Step("I pw generate state as {string}", async (page: any, alias: string) => {
    const value = faker.location.state();
    storeGeneratedValue(page, alias, value, "state");
});

/**
 * Generates a random country.
 * @example When I pw generate country as "country"
 */
Step("I pw generate country as {string}", async (page: any, alias: string) => {
    const value = faker.location.country();
    storeGeneratedValue(page, alias, value, "country");
});

/**
 * Generates a random zip/postal code.
 * @example When I pw generate zip code as "zipCode"
 */
Step("I pw generate zip code as {string}", async (page: any, alias: string) => {
    const value = faker.location.zipCode();
    storeGeneratedValue(page, alias, value, "zip code");
});

// ==================================================
// COMPANY GENERATORS
// ==================================================

/**
 * Generates a random company name.
 * @example When I pw generate company name as "companyName"
 */
Step("I pw generate company name as {string}", async (page: any, alias: string) => {
    const value = faker.company.name();
    storeGeneratedValue(page, alias, value, "company name");
});

/**
 * Generates a random catch phrase.
 * @example When I pw generate catch phrase as "catchPhrase"
 */
Step("I pw generate catch phrase as {string}", async (page: any, alias: string) => {
    const value = faker.company.catchPhrase();
    storeGeneratedValue(page, alias, value, "catch phrase");
});

/**
 * Generates random buzzwords.
 * @example When I pw generate buzzwords as "buzzwords"
 */
Step("I pw generate buzzwords as {string}", async (page: any, alias: string) => {
    const value = faker.company.buzzPhrase();
    storeGeneratedValue(page, alias, value, "buzzwords");
});

// ==================================================
// FINANCE GENERATORS
// ==================================================

/**
 * Generates a random amount (currency value).
 * @example When I pw generate amount as "amount"
 */
Step("I pw generate amount as {string}", async (page: any, alias: string) => {
    const value = faker.finance.amount();
    storeGeneratedValue(page, alias, value, "amount");
});

/**
 * Generates a random amount with min/max.
 * @example When I pw generate amount between {int} and {int} as "randomAmount"
 */
Step("I pw generate amount between {int} and {int} as {string}", async (page: any, min: number, max: number, alias: string) => {
    const value = faker.finance.amount({ min, max });
    storeGeneratedValue(page, alias, value, `amount (${min}-${max})`);
});

/**
 * Generates a random IBAN.
 * @example When I pw generate iban as "iban"
 */
Step("I pw generate iban as {string}", async (page: any, alias: string) => {
    const value = faker.finance.iban();
    storeGeneratedValue(page, alias, value, "IBAN");
});

/**
 * Generates a random credit card number.
 * @example When I pw generate credit card number as "creditCard"
 */
Step("I pw generate credit card number as {string}", async (page: any, alias: string) => {
    const value = faker.finance.creditCardNumber();
    storeGeneratedValue(page, alias, value, "credit card number");
});

// ==================================================
// DATE/TIME GENERATORS
// ==================================================

/**
 * Generates a random past date.
 * @example When I pw generate past date as "pastDate"
 */
Step("I pw generate past date as {string}", async (page: any, alias: string) => {
    const value = faker.date.past().toISOString();
    storeGeneratedValue(page, alias, value, "past date");
});

/**
 * Generates a random future date.
 * @example When I pw generate future date as "futureDate"
 */
Step("I pw generate future date as {string}", async (page: any, alias: string) => {
    const value = faker.date.future().toISOString();
    storeGeneratedValue(page, alias, value, "future date");
});

/**
 * Generates a random recent date.
 * @example When I pw generate recent date as "recentDate"
 */
Step("I pw generate recent date as {string}", async (page: any, alias: string) => {
    const value = faker.date.recent().toISOString();
    storeGeneratedValue(page, alias, value, "recent date");
});

/**
 * Generates a random birthdate.
 * @example When I pw generate birthdate as "birthdate"
 */
Step("I pw generate birthdate as {string}", async (page: any, alias: string) => {
    const value = faker.date.birthdate().toISOString();
    storeGeneratedValue(page, alias, value, "birthdate");
});

// ==================================================
// COLOR GENERATORS
// ==================================================

/**
 * Generates a random color name.
 * @example When I pw generate color as "color"
 */
Step("I pw generate color as {string}", async (page: any, alias: string) => {
    const value = faker.color.human();
    storeGeneratedValue(page, alias, value, "color");
});

/**
 * Generates a random RGB color.
 * @example When I pw generate rgb color as "rgbColor"
 */
Step("I pw generate rgb color as {string}", async (page: any, alias: string) => {
    const value = faker.color.rgb();
    storeGeneratedValue(page, alias, value, "RGB color");
});

// ==================================================
// LENGTH UTILITY
// ==================================================

/**
 * Stores the length of a previously generated value.
 * @example When I pw get length of "username" as "usernameLength"
 */
Step("I pw get length of {string} as {string}", async (page: any, sourceAlias: string, targetAlias: string) => {
    const value = getVariable(page, sourceAlias);
    if (value === undefined) {
        throw new Error(`❌ No value found for alias "@${sourceAlias}"`);
    }
    const length = String(value).length;
    setVariable(page, targetAlias, length);
    console.log(`📏 Length of "@${sourceAlias}": ${length} (stored as @${targetAlias})`);
});

/**
 * Asserts that a generated value has a specific length.
 * @example Then I pw expect "@username" to have length {int}
 */
Step("I pw expect {string} to have length {int}", async (page: any, alias: string, expectedLength: number) => {
    const cleanAlias = alias.startsWith('@') ? alias.slice(1) : alias;
    const value = getVariable(page, cleanAlias);
    if (value === undefined) {
        throw new Error(`❌ No value found for alias "${alias}"`);
    }
    const actualLength = String(value).length;
    if (actualLength !== expectedLength) {
        throw new Error(`Expected length ${expectedLength}, but got ${actualLength}`);
    }
    console.log(`✅ "@${cleanAlias}" has length ${expectedLength}`);
});
