import "./index.css";

// based on where we are, change the value on "runStep" at the bottom of this file :)

import { run as run1 } from "./1-simple-validation";
import { run as run2 } from "./2-generic-schema";
import { run as run3 } from "./3-conditional-types";
import { run as run4 } from "./4-inferring-conditional-types";

type Step = 1 | 2 | 3 | 4;

function runStep(step: Step) {
  switch (step) {
    case 1:
      run1();
      break;
    case 2:
      run2();
      break;
    case 3:
      run3();
      break;
    case 4:
      run4();
      break;
  }
}

// Update step to the where we are
runStep(1);
