var firebaseConfig = {
	apiKey: "AIzaSyC5T9OSpE45K_lNDMcSvjc47MEi46bRAAc",
	authDomain: "covid-testy.firebaseapp.com",
	databaseURL: "https://covid-testy-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "covid-testy",
	storageBucket: "covid-testy.appspot.com",
	messagingSenderId: "610227051278",
	appId: "1:610227051278:web:cadf4b6a0617673177955f",
	measurementId: "G-TFQ8X08RJB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();

const searchQuery = document.querySelector('#peliKupon');
const email = document.querySelector('#email');
const targetQuery = document.querySelector('.exchangeCouponSection input');
const label = document.querySelector('.exchangeCouponSection .uk-label');
const descriptionText = document.querySelector('.exchangeCouponSection .uk-card-body p');
const checkCouponBtn = document.querySelector('#checkBtn');

let clicked = 0;
let btnText = checkCouponBtn.innerHTML;

function checkFormValidation(el) {
	if (el.validationMessage === '' && el.classList.contains('uk-form-danger')) {
		el.classList.remove('uk-form-danger')
		return;
	} else if (el.validationMessage !== '') {
		el.classList.add('uk-form-danger', 'uk-animation-shake');
		setTimeout(() => {
			el.classList.remove('uk-animation-shake');
		}, 500);	
	}
}

function runSpinner() {
	if (checkCouponBtn.hasAttribute('uk-spinner')) {
		checkCouponBtn.removeAttribute('uk-spinner');
		checkCouponBtn.innerHTML = btnText;
		return;
	}
	checkCouponBtn.setAttribute('uk-spinner', '');
	checkCouponBtn.innerHTML = '';
}

function checkCoupon() {
	const allCoupons = db.collection("coupons").doc("u06NPpMpuEyLXxwApD5s");
	if (email.checkValidity() && searchQuery.checkValidity()) {
		runSpinner();
		checkFormValidation(email);
		checkFormValidation(searchQuery);
		allCoupons.get().then((doc) => {
			function getObject(object, string) {
				var result;
				if (!object || typeof object !== 'object') return;
				Object.values(object).some(v => {
					if (v === string) return result = object;
					return result = getObject(v, string);
				});
				return result;
			}

			function validEntry() {
				searchQuery.classList.remove('uk-form-danger');
				checkCouponBtn.setAttribute('disabled', '');
				email.setAttribute('disabled', '');
				searchQuery.setAttribute('disabled', '');
				if (usedPeliCoupon && searchQuery.value !== texts.usableCoupon) {
					descriptionText.innerHTML = texts.descriptionSuccessOver.replace('variable', `${searchQuery.value}`);	
				} else {
					descriptionText.innerHTML = texts.descriptionSuccess.replace('variable', `${searchQuery.value}`);	
				}
			}

			function animateSection() {
				document.querySelector('.exchangeCouponSection .uk-card').removeAttribute('hidden');
				document.querySelector('.exchangeCouponSection .uk-card').classList.add('uk-animation-slide-top-medium');
			}

			function addBtnSetting() {
				const btnCopy = document.querySelector('.exchangeCouponSection .uk-card-footer .uk-button:nth-child(1)');
				const btnApply = document.querySelector('.exchangeCouponSection .uk-card-footer .uk-button:nth-child(2)');

				btnCopy.innerHTML = texts.btnCopy;
				btnApply.innerHTML = texts.btnApply;
				btnApply.setAttribute('href', `${texts.btnApplyUrl}`);
			}

			document.querySelector("#copy").addEventListener("click", function () {
				navigator.clipboard.writeText(targetQuery.value)
				UIkit.notification(`${texts.notifCopy}`, { status: 'success' });
			});

			const medirexCoupons = doc.data().medirexCoupons;
			const usedPeliCoupon = getObject(medirexCoupons, searchQuery.value);
			const usedEmail = getObject(medirexCoupons, email.value);
			const texts = doc.data().texts;
			
			if (doc.data().peliCoupons.includes(searchQuery.value) && (!usedPeliCoupon || (usedPeliCoupon.peliCoupon === texts.usableCoupon && !usedEmail))) {
				const getValidCoupon = getObject(medirexCoupons, Boolean(0));
				validEntry();
				animateSection();
				
				if (getValidCoupon) {
					addBtnSetting();
					targetQuery.value = getValidCoupon.coupon;
					label.innerHTML = texts.labelSuccess;
					label.classList.add('uk-label-success');

					const indexOfValidCoupon = medirexCoupons.indexOf(getValidCoupon);
					let localCoupon = medirexCoupons[indexOfValidCoupon];
					localCoupon.used = true;
					localCoupon.timestamp = new Date().toISOString();
					localCoupon.peliCoupon = searchQuery.value;
					localCoupon.userEmail = email.value;
					medirexCoupons[indexOfValidCoupon] = localCoupon;
					allCoupons.update({
						medirexCoupons: medirexCoupons
					});
					UIkit.notification(`<span uk-icon="icon: check"></span> ${texts.notifSuccess}`, { status: 'success' });
				} else {
					targetQuery.remove();
					descriptionText.innerHTML = texts.descriptionError.replace('variable', `${searchQuery.value}`);
					document.querySelector('.exchangeCouponSection .uk-card-footer').remove();
					label.innerHTML = texts.labelError;
					label.classList.add('uk-label-warning');

					UIkit.notification(`<span uk-icon="icon: warning"></span> ${texts.notifError}`, { status: 'warning' });
				}
				runSpinner();
			} else if (doc.data().peliCoupons.includes(searchQuery.value) && ((usedPeliCoupon && usedPeliCoupon.peliCoupon !== texts.usableCoupon) || (usedPeliCoupon && usedPeliCoupon.peliCoupon === texts.usableCoupon && usedEmail))) {
				animateSection();
				addBtnSetting();
				usedPeliCoupon.peliCoupon === texts.usableCoupon && usedEmail ? targetQuery.value = usedEmail.coupon : targetQuery.value = usedPeliCoupon.coupon;
				label.innerHTML = texts.labelSuccess;
				label.classList.add('uk-label-success');
				UIkit.notification(`<span uk-icon="icon: check"></span> ${texts.notifSuccess}`, { status: 'success' });
				validEntry();
				runSpinner();
			} else {
				searchQuery.classList.add('uk-form-danger', 'uk-animation-shake');
				setTimeout(() => {
					searchQuery.classList.remove('uk-animation-shake');
				}, 500);
				clicked += 1;
				if (clicked === 3) {
					validEntry();
					UIkit.notification(`<span uk-icon="icon: warning"></span> ${texts.notifInvalidCouponBlocked}`, { status: 'danger' });
				} else { UIkit.notification(`<span uk-icon="icon: warning"></span> ${texts.notifInvalidCoupon}`, { status: 'danger' }); };
				runSpinner();
			}
		});
	} else {
		checkFormValidation(email);
		checkFormValidation(searchQuery);
		if (email.validationMessage) UIkit.notification(`<span uk-icon="icon: warning"></span> E-mail: ${email.validationMessage}`, { status: 'danger' });
		if (searchQuery.validationMessage) UIkit.notification(`<span uk-icon="icon: warning"></span> Kupón: ${searchQuery.validationMessage}`, { status: 'danger' });
	}
}
