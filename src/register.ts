// src/register.ts
import { checkPeerDependencies } from "./helpers/checkPeerDeps";
checkPeerDependencies(["@cucumber/cucumber", "@playwright/test", "@faker-js/faker"]);
import "./index";
