const lengthElement = document.getElementById("length");
const upperCaseElement = document.getElementById("upperCase");
const lowerCaseElement = document.getElementById("lowerCase");
const numbersElement = document.getElementById("numbers");
const symbolsElement = document.getElementById("symbols");
const generate = document.getElementById("generate");
const resultElement = document.getElementById("result");

const MIN_LENGTH = 1;
const MAX_LENGTH = 50;

const UPPER_CASE = getArray("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const LOWER_CASE = getArray("abcdefghijklmnopqrstuvwxyz");
const NUMBERS = getArray("1234567890");
const SYMBOLS = getArray("~`!@#$%^&*()-_=+[{]}|;:,<>.?/");

// default length and hint for the copy feature
lengthElement.value = 12;
resultElement.title = "Click to copy";

function getArray(str) {
  return str.split("");
}

generate.addEventListener("click", () => {
  const length = parseInt(lengthElement.value, 10);

  const password = generatePassword(
    length,
    upperCaseElement.checked,
    lowerCaseElement.checked,
    numbersElement.checked,
    symbolsElement.checked
  );

  resultElement.innerText = password ?? "";
});

// click the password to copy it
resultElement.addEventListener("click", async () => {
  const text = resultElement.innerText.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showModal({
      type: "success",
      icon: "✅",
      title: "Copied!",
      message: "Your password is copied to the clipboard.",
      buttonText: "Great",
    });
  } catch (error) {
    console.error("Copy failed:", error);
    showModal({
      type: "error",
      icon: "⚠️",
      title: "Copy failed",
      message: "Your browser blocked clipboard access. Try opening the page from localhost or https.",
      buttonText: "OK",
    });
  }
});

function generatePassword(length, upperChecked, lowerChecked, numbersChecked, symbolsChecked) {
  if (isNaN(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
    showModal({
      type: "error",
      icon: "🔢",
      title: "Invalid length",
      message: `Please choose a length between ${MIN_LENGTH} and ${MAX_LENGTH}.`,
      buttonText: "OK",
    });
    return null;
  }

  let passArray = [];
  if (upperChecked) passArray = passArray.concat(UPPER_CASE);
  if (lowerChecked) passArray = passArray.concat(LOWER_CASE);
  if (numbersChecked) passArray = passArray.concat(NUMBERS);
  if (symbolsChecked) passArray = passArray.concat(SYMBOLS);

  if (passArray.length === 0) {
    showModal({
      type: "error",
      icon: "☑️",
      title: "Nothing selected",
      message: "Please choose at least one option: uppercase, lowercase, numbers, or symbols.",
      buttonText: "OK",
    });
    return null;
  }

  // crypto.getRandomValues is stronger than Math.random for passwords
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += passArray[randomValues[i] % passArray.length];
  }
  return password;
}