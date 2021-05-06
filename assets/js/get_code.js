"use strict";

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
	} else {
		checkCouponBtn.setAttribute('uk-spinner', '');
		checkCouponBtn.innerHTML = '';
	}
}

function getObject(object, string) {
	var result;
	if (!object || typeof object !== 'object') return;
	Object.values(object).some(v => {
		if (v === string) return result = object;
		return result = getObject(v, string);
	});
	return result;
}

function checkCoupon() {
	const allCoupons = db.collection("coupons").doc("u06NPpMpuEyLXxwApD5s");
	if (email.checkValidity()) {
		checkFormValidation(email);
		runSpinner();
		firebase.auth().signInAnonymously().then(() => {
			allCoupons.get().then((doc) => {
				const medirexCoupons = doc.data().medirexCoupons;
				// const usedPeliCoupon = getObject(medirexCoupons, searchQuery.value.toUpperCase());
				const usedEmail = getObject(medirexCoupons, email.value);
				const texts = doc.data().texts;
				const btnCopy = document.querySelector('.exchangeCouponSection .uk-card-footer div:nth-child(1) > button');
				const btnApply = document.querySelector('.exchangeCouponSection .uk-card-footer div:nth-child(2) > a');

				function validEntry() {
					checkCouponBtn.classList.add('uk-disabled');
					checkCouponBtn.setAttribute('disabled', '');
					email.setAttribute('disabled', '');
					if (usedEmail) {
						descriptionText.innerHTML = texts.descriptionSuccessOver.replace('variable', `${email.value}`);	
					} else {
						descriptionText.innerHTML = texts.descriptionSuccess.replace('variable', `${email.value}`);
					}
				}

				function animateSection() {
					document.querySelector('.exchangeCouponSection hr').removeAttribute('hidden');
					document.querySelector('.exchangeCouponSection hr').classList.add('uk-animation-slide-top-medium');
					document.querySelector('.exchangeCouponSection .uk-card').removeAttribute('hidden');
					document.querySelector('.exchangeCouponSection .uk-card').classList.add('uk-animation-slide-top-medium');
					document.querySelector('.exchangeCouponSection hr').classList.remove('uk-margin-remove-bottom');
				}

				function addBtnSetting() {
					btnCopy.innerHTML = texts.btnCopy;
					btnApply.innerHTML = texts.btnApply;
					btnApply.setAttribute('href', `${texts.btnApplyUrl}`);
				}

				btnCopy.addEventListener("click", () => {
					navigator.clipboard.writeText(targetQuery.value)
					UIkit.notification(`${texts.notifCopy}`, { status: 'success' });
				});
				
				if (!usedEmail) {
					const getValidCoupon = getObject(medirexCoupons, Boolean(0));
					validEntry();
					
					if (getValidCoupon) {
						addBtnSetting();
						targetQuery.value = getValidCoupon.coupon;
						label.innerHTML = texts.labelSuccess;
						label.classList.add('uk-label-success');

						const indexOfValidCoupon = medirexCoupons.indexOf(getValidCoupon);
						let localCoupon = medirexCoupons[indexOfValidCoupon];
						localCoupon.used = true;
						localCoupon.timestamp = new Date().toISOString();
						localCoupon.userEmail = email.value;
						medirexCoupons[indexOfValidCoupon] = localCoupon;
						allCoupons.update({
							medirexCoupons: medirexCoupons
						});
						UIkit.notification(`<span uk-icon="icon: check"></span> ${texts.notifSuccess}`, { status: 'success' });
					} else {
						targetQuery.remove();
						descriptionText.innerHTML = texts.descriptionError.replace('variable', `${email.value}`);
						document.querySelector('.exchangeCouponSection .uk-card-footer').remove();
						label.innerHTML = texts.labelError;
						label.classList.add('uk-label-warning');

						UIkit.notification(`<span uk-icon="icon: warning"></span> ${texts.notifError}`, { status: 'warning' });
					}
					animateSection();
					runSpinner();
				} else {
					validEntry();
					addBtnSetting();
					targetQuery.value = usedEmail.coupon;
					label.innerHTML = texts.labelSuccess;
					label.classList.add('uk-label-success');
					UIkit.notification(`<span uk-icon="icon: check"></span> ${texts.notifSuccess}`, { status: 'success' });
					animateSection();
					runSpinner();
				}
			});
		})
		.catch((error) => {
			setTimeout(() => {
				UIkit.notification(`<span uk-icon="icon: warning"></span> Neočakávaná chyba!`, { status: 'danger' });
				runSpinner();
			}, 500);
		});
	} else {
		checkFormValidation(email);
		if (email.validationMessage) UIkit.notification(`<span uk-icon="icon: warning"></span> E-mail: ${email.validationMessage}`, { status: 'danger' });
	}
}
