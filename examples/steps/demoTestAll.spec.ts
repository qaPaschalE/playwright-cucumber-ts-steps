// demo.spec.ts
import { runTests } from "../../";

// 1. Basic Element Interactions
runTests("features/click-test.feature");
runTests("features/find.feature");
runTests("features/demo.feature");

// 2. Forms and Inputs
runTests("features/form-test.feature");
runTests("features/inputs.test.feature");

// 3. Hardware Interactions (Mouse/Keyboard/Mobile)
runTests("features/mouse-test.feature");
runTests("features/keyboard-test.feature");
runTests("features/mobile-test.feature");

// 4. Advanced Networking & Mocking
runTests("features/network-test.feature");
runTests("features/mock_test.feature");

// 5. Utilities & Database
runTests("features/db_test.feature");
runTests("features/misc-test.feature");
