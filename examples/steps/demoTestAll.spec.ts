// demo.spec.ts
import { runTests } from "../../";

// 1. Basic Element Interactions
runTests("examples/click-test.feature");
runTests("examples/find.feature");
runTests("examples/demo.feature");

// 2. Forms and Inputs
runTests("examples/form-test.feature");
runTests("examples/inputs.test.feature");

// 3. Hardware Interactions (Mouse/Keyboard/Mobile)
runTests("examples/mouse-test.feature");
runTests("examples/keyboard-test.feature");
runTests("examples/mobile-test.feature");

// 4. Advanced Networking & Mocking
runTests("examples/network-test.feature");
runTests("examples/mock_test.feature");

// 5. Utilities & Database
runTests("examples/db_test.feature");
runTests("examples/misc-test.feature");
