const couponSection = document.querySelector('.exchange-coupon__section');
const covidListSection = document.querySelector('.rychlotest-deals__section');

const btsBtn = document.querySelector('#chooseBTS');
const anotherBtn = document.querySelector('#chooseAnother');

function showSection(name) {
  name.removeAttribute('hidden');
  name.classList.add('uk-animation-slide-bottom-small');
  setTimeout(() => {
    name.classList.remove('uk-animation-slide-bottom-small');
  }, 500);
}

btsBtn.addEventListener('click', () => {
  btsBtn.classList.replace('uk-button-default', 'uk-button-primary');
  if (!couponSection.hasAttribute('hidden')) {
    anotherBtn.classList.replace('uk-button-primary', 'uk-button-default');
    couponSection.setAttribute('hidden', '');
  }
  showSection(covidListSection);
});

anotherBtn.addEventListener('click', () => {
  anotherBtn.classList.replace('uk-button-default', 'uk-button-primary');
  if (!covidListSection.hasAttribute('hidden')) {
    btsBtn.classList.replace('uk-button-primary', 'uk-button-default');
    covidListSection.setAttribute('hidden', '');
  }
  showSection(couponSection);
});