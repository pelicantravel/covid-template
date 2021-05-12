const couponSection = document.querySelector('.exchange-coupon__section');
const covidTestType = document.querySelector('.rychlotest-type__section');
const digitalParkSection = document.querySelector('.rychlotest-digitalpark__section');
const skyParkSection = document.querySelector('.rychlotest-skypark__section');

const btnSkyPark = document.querySelector('.rychlotest-type__section a:first-of-type');
const btnDigitalPark = document.querySelector('.rychlotest-type__section a:last-of-type');

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
  btsBtn.classList.add('active');
  if (!couponSection.hasAttribute('hidden')) {
    anotherBtn.classList.replace('uk-button-primary', 'uk-button-default');
    anotherBtn.classList.remove('active');
    couponSection.setAttribute('hidden', '');
  }
  hideSection(digitalParkSection);
  hideSection(skyParkSection);
  showSection(covidTestType);
});

anotherBtn.addEventListener('click', () => {
  anotherBtn.classList.replace('uk-button-default', 'uk-button-primary');
  anotherBtn.classList.add('active');
  if (!covidTestType.hasAttribute('hidden')) {
    btsBtn.classList.replace('uk-button-primary', 'uk-button-default');
    btsBtn.classList.remove('active');
    hideSection(covidTestType);
  }
  if (!digitalParkSection.hasAttribute('hidden')) {
    btsBtn.classList.replace('uk-button-primary', 'uk-button-default');
    btsBtn.classList.remove('active');
    hideSection(digitalParkSection);
  }
  if (!skyParkSection.hasAttribute('hidden')) {
    btsBtn.classList.replace('uk-button-primary', 'uk-button-default');
    btsBtn.classList.remove('active');
    hideSection(skyParkSection);
  }
  showSection(couponSection);
});

btnDigitalPark.addEventListener('click', () => {
  hideSection(covidTestType);
  showSection(digitalParkSection);
});

btnSkyPark.addEventListener('click', () => {
  hideSection(covidTestType);
  showSection(skyParkSection);
});