const couponSection = document.querySelector('.exchange-coupon__section');
const covidTestType = document.querySelector('.rychlotest-type__section');
const slinnyPCRSection = document.querySelector('.rychlotest-slinny__section');
const nosohltanPCRSection = document.querySelector('.rychlotest-nosohltan__section');

const btnSlinnyPCR = document.querySelector('.rychlotest-type__section a:first-of-type');
const btnNosohltanPCR = document.querySelector('.rychlotest-type__section a:last-of-type');

const btsBtn = document.querySelector('#chooseBTS');
const anotherBtn = document.querySelector('#chooseAnother');

function showSection(name) {
  name.removeAttribute('hidden');
  name.classList.add('uk-animation-slide-bottom-medium');
  setTimeout(() => {
    name.classList.remove('uk-animation-slide-bottom-medium');
  }, 500);
}

function hideSection(name) {
  name.setAttribute('hidden', '');
}

btsBtn.addEventListener('click', () => {
  btsBtn.classList.replace('uk-button-default', 'uk-button-primary');
  if (!couponSection.hasAttribute('hidden')) {
    anotherBtn.classList.replace('uk-button-primary', 'uk-button-default');
    couponSection.setAttribute('hidden', '');
  }
  hideSection(slinnyPCRSection);
  hideSection(nosohltanPCRSection);
  showSection(covidTestType);
});

anotherBtn.addEventListener('click', () => {
  anotherBtn.classList.replace('uk-button-default', 'uk-button-primary');
  if (!covidTestType.hasAttribute('hidden')) {
    btsBtn.classList.replace('uk-button-primary', 'uk-button-default');
    hideSection(covidTestType);
  }
  if (!slinnyPCRSection.hasAttribute('hidden')) {
    btsBtn.classList.replace('uk-button-primary', 'uk-button-default');
    hideSection(slinnyPCRSection);
  }
  if (!nosohltanPCRSection.hasAttribute('hidden')) {
    btsBtn.classList.replace('uk-button-primary', 'uk-button-default');
    hideSection(nosohltanPCRSection);
  }
  showSection(couponSection);
});

btnSlinnyPCR.addEventListener('click', () => {
  hideSection(covidTestType);
  showSection(slinnyPCRSection);
});

btnNosohltanPCR.addEventListener('click', () => {
  hideSection(covidTestType);
  showSection(nosohltanPCRSection);
});