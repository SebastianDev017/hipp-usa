const $errorMessage = document.querySelector('.shopify-challenge__error');
const $message = document.querySelector('.shopify-challenge__message');
const $submitInput = document.querySelector('input.shopify-challenge__button');

if (typeof($errorMessage) != 'undefined' && $errorMessage != null) {
  $errorMessage.classList.add('page-text', 'page-text-fit');
}

if (typeof($message) != 'undefined' && $message != null) {
  $message.classList.add('page-text', 'page-text-fit');
}

if (typeof($submitInput) != 'undefined' && $submitInput != null) {
  $submitInput.classList.add('button');
}
