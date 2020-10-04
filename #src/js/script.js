"use strict";

function testWebP(callback) {

	let webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

const prices = {
	table: 23000,
	chair: 17000,
	lamp: 5000,
	shipping: 1000
}

//Оьъект - форма обратной связи
const modalCallbackForm = {
	html: `
		<div class="modal">
			<div class="modal__wrapper">
				<div class="modal__header">Оформление заказа</div>
					<div class="modal__content">
						<p>Пожалуйста, заполните все поля, и мы обязательно свяжемся с вами</p>
						<form id="form_callback" class="form_callback">
							<input type="text" name="user_name" placeholder="Ваше имя">
							<input type="tel" name="user_phone" placeholder="Ваш телефон" required>
							<p>Выберите комплетацию:</p>
							<table class="form_callback__table">
								<tr class="form_callback__table_row">
									<td>
										<label for="quantity_table">Стол</label>
									</td>
									<td>
										<button class="quantity_dec" data-change=-1>&#8249;</button>
										<input type="text" name="quantity_table" id="quantity_table" size="2" readonly value=0>
										<input type="hidden" name="cost_table" value=0>
										<button class="quantity_inc" data-change=1>&#8250;</button>
									</td>
									<td>
										= <div class="price"><span class="price_value" data-of="table">0</span> ₸</div>
									</td>
								</tr>
								<tr class="form_callback__table_row">
									<td>
										<label for="quantity_lamp">Лампа</label>
									</td>
									<td>
										<button class="quantity_dec" data-change=-1>&#8249;</button>
										<input type="text" name="quantity_lamp" id="quantity_lamp" size="2" readonly value=0>
										<input type="hidden" name="cost_lamp" value=0>
										<button class="quantity_inc" data-change=1>&#8250;</button>
									</td>
									<td>
										= <div class="price"><span class="price_value" data-of="lamp">0</span> ₸</div>
									</td>
								</tr>
								<tr class="form_callback__table_row">
									<td>
										<label for="quantity_chair">Стул</label>
									</td>
									<td>
										<button class="quantity_dec" data-change=-1>&#8249;</button>
										<input type="text" name="quantity_chair" id="quantity_chair" size="2" readonly value=0>
										<input type="hidden" name="cost_chair" value=0>
										<button class="quantity_inc" data-change=1>&#8250;</button>
									</td>
									<td>
										= <div class="price"><span class="price_value" data-of="chair">0</span> ₸</div>
									</td>
								</tr>
							</table>
							<table class="shipping_wrapper"><tr>
								<td>
									<label for="need_shipping">Доставка</label>
								</td>
								<td>
									<input type="checkbox" name="need_shipping" id="need_shipping">
									<input type="hidden" name="shipping_cost" id="shipping_cost" value=0>
								</td>
								<td>
									= <div class="price"><span class="price_value" data-of="chair">0</span> ₸</div>
								</td></tr>
							</table>
							<div class="gift"></div>
							<div class="benefit"></div>
							<div class="price_total">Итого: <span class="price_value">0</span> ₸
								<input type="hidden" name="cost_total" value=0>
							</div>
							
							<input type="submit" id="modal__button_submit" value="Заказать">
						</form>
						<div class="modal__footer">
					</div>
					<div class="preloader"></div>
				</div>
				<button class="modal__button-close">&#10006;</button>
			</div>
		</div>`,
	successHTML: `<div class="success">Спасибо! Мы с вами свяжемся в самое ближайшее время.</div>`,
	preloaderToggle: function() {
		const loadingBlock = document.querySelector('.modal__content .preloader');
		loadingBlock.classList.toggle('active');
	},
	init: function () {
		document.body.insertAdjacentHTML('beforeEnd', this.html);
		const formCallback = document.querySelector('form#form_callback');
		formCallback.onsubmit = async (e) => {
			e.preventDefault();
			//! Пересчет сумм на случай умельца, который подменит значения сумм в скрытых инпутах
			this.preloaderToggle();
			this.calculate();

			let response = await fetch('/admin/order.php', {
			method: 'POST',
			body: new FormData(formCallback)
			});
			let result = await response.json();
			console.dir(result);
			if(result) {
				this.submitted();
				this.preloaderToggle();
			}
		};
	},
	show: function() {
		console.log('modal show');
		const modal = document.querySelector('.modal');
		modal.classList.add('active');
	},
	hide: function() {
		const modal = document.querySelector('.modal');
		modal.classList.remove('active');
	},
	submitted: function() {
		const modalContent = document.querySelector('.modal .modal__content ');
		modalContent.innerHTML = this.successHTML;
	},
	calculate: function() {
		const	modal = document.querySelector('.modal'),
				form = modal.querySelector('form'),
				table = modal.querySelector('table'),
				nodes = {
					table: { 
						fields: {
							quantity: table.querySelector('input[name=quantity_table]'), 
							cost: table.querySelector('input[name=cost_table]'),
						}, 
						view: table.querySelector('input[name=quantity_table]').parentElement.parentElement
									  .querySelector('.price_value')
					},
					lamp: {
						fields: {
							quantity: table.querySelector('input[name=quantity_lamp]'), 
							cost: table.querySelector('input[name=cost_lamp]')
						}, 
						view:  table.querySelector('input[name=quantity_lamp]').parentElement.parentElement
						.querySelector('.price_value')
					},
					chair: { 
						fields: {
							quantity: table.querySelector('input[name=quantity_chair]'), 
							cost: table.querySelector('input[name=cost_chair]')
						}, 
						view:  table.querySelector('input[name=quantity_chair]').parentElement.parentElement
						.querySelector('.price_value')
					},
					shipping: {
						fields: {
							checkbox: form.querySelector('input[name=need_shipping]'),
							cost: form.querySelector('input[name=shipping_cost]')
						},
						view: form.querySelector('.shipping_wrapper .price_value')
					},					
					total: {
						fields: {
							cost: form.querySelector('input[name=cost_total]')
						},
						view: form.querySelector('.price_total .price_value')
					}
				};
		for(let prod in nodes) {
			if (prod == 'total') {
				nodes.total.fields.cost.value = 
					+nodes.table.fields.cost.value + +nodes.lamp.fields.cost.value + +nodes.chair.fields.cost.value + +nodes.shipping.fields.cost.value;
				nodes.total.view.textContent = +nodes.total.fields.cost.value;
			} else if (prod == 'shipping') {
				let shippingCost = nodes.shipping.fields.checkbox.checked ? prices.shipping : 0;
				nodes.shipping.fields.cost.value = shippingCost;
				nodes.shipping.view.textContent = shippingCost;
			} 
			else {
				nodes[prod].fields.cost.value = +nodes[prod].fields.quantity.value * +prices[prod];
				nodes[prod].view.textContent = +nodes[prod].fields.cost.value;
			}
		};

		//Применяем скидку
		const	gift = form.querySelector('.gift'),
				benefit = form.querySelector('.benefit'),
				quantityTables = nodes.table.fields.quantity.value,
				quantityChairs = nodes.chair.fields.quantity.value;

		let giftLamps = Math.min(quantityTables, quantityChairs);
		let discountedPrice = +nodes.total.fields.cost.value - prices.lamp * Math.min(giftLamps, nodes.lamp.fields.quantity.value);
		if(discountedPrice < 0) { discountedPrice = 0; }

		let totalPriceLamp = prices.lamp * (nodes.lamp.fields.quantity.value - giftLamps);
		if (totalPriceLamp < 0) { totalPriceLamp = 0; }
		nodes.lamp.fields.cost.value = totalPriceLamp;
		nodes.lamp.view.textContent = totalPriceLamp;
		nodes.total.fields.cost.value = +discountedPrice;
		nodes.total.view.textContent = +discountedPrice;

		if(giftLamps > 0) {
			gift.innerHTML = `Ваш подарок: <b>${giftLamps}</b> ламп${numWordEnding(giftLamps)}`;
			benefit.innerHTML = `Выгода: <b>${giftLamps*prices.lamp}</b> ₸`;
		}
		else {
			gift.innerHTML = '';
			benefit.innerHTML = '';
		}
		
	}
};

document.addEventListener('DOMContentLoaded', () => {
	modalCallbackForm.init();
	const btn = document.querySelector('.btn'),
		modal = document.querySelector('.modal'),
		table = modal.querySelector('table'),
		btnClose = modal.querySelector('.modal__button-close'),
		shippingCheckbox = modal.querySelector('input[name=need_shipping]');
	btn.addEventListener('click', (event) => {
		modalCallbackForm.show();
	});
	btnClose.addEventListener('click', (event) => {
		modalCallbackForm.hide();
	});

	table.addEventListener('click', (event) => {
		event.preventDefault();
		if(event.target.tagName != 'BUTTON') { return; }
		const inputQuantity = event.target.parentElement.querySelector('input[type=text]');
		inputQuantity.value = +inputQuantity.value + +event.target.dataset.change;
		if (+inputQuantity.value < 0) { inputQuantity.value = 0; }
		// inputQuantity.parentElement.querySelector('input[type=hidden]').value = +price.textContent;
		modalCallbackForm.calculate();
	});
	shippingCheckbox.addEventListener('change', (event) => {
		modalCallbackForm.calculate();
	});

});

function numWordEnding(number) {
	const last2Num = Math.floor((number/100 - Math.floor(number/100)) * 100);
	const lastNum = Math.floor((number/10 - Math.floor(number/10)) * 10);
	if (last2Num >= 11 && last2Num <= 19) { return ''; }
	switch(lastNum) {
		case 1: return 'а';
		case 2:
		case 3:
		case 4: return 'ы';
		default: return '';
	}
}



