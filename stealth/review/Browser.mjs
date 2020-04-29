
import { Browser, isBrowser, isConfig                                 } from '../../stealth/source/Browser.mjs';
import { isTab                                                        } from '../../stealth/source/Tab.mjs';
import { after, before, describe, finish                              } from '../../covert/index.mjs';
import { connect as connect_stealth, disconnect as disconnect_stealth } from './Stealth.mjs';



before(connect_stealth);

export const connect = describe('Browser.prototype.connect()', function(assert) {

	this.browser = new Browser({
		host: '127.0.0.1'
	});


	this.tab = null;

	this.browser.once('connect', () => {

		this.browser.set({
			domain: 'example.com',
			mode: {
				text:  true,
				image: false,
				audio: false,
				video: false,
				other: false
			}
		});

		assert(this.browser.get('example.com'), {
			domain: 'example.com',
			mode: {
				text:  true,
				image: false,
				audio: false,
				video: false,
				other: false
			}
		});

		this.tab = this.browser.open('https://example.com');

		assert(isTab(this.tab), true);

	});

	this.browser.connect();

});

describe('new Browser()', function(assert) {

	let browser = new Browser({
		host: '127.0.0.3'
	});

	assert(browser._settings.host,  '127.0.0.3');
	assert(browser._settings.debug, false);

	assert(Browser.isBrowser(browser), true);
	assert(isBrowser(browser),         true);

});

describe('Browser.isBrowser()', function(assert) {

	assert(typeof Browser.isBrowser, 'function');

	assert(Browser.isBrowser(this.browser), true);

});

describe('isBrowser()', function(assert) {

	assert(typeof isBrowser, 'function');

	assert(isBrowser(this.browser), true);

});

describe('Browser.isConfig()', function(assert) {

	let cfg1 = {
		domain: null
	};

	let cfg2 = {
		domain: 'example.com',
		mode: {
			text: false
		}
	};

	let cfg3 = {
		domain: null,
		mode: {
			text:  true,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	};

	let cfg4 = {
		domain: 'example.com',
		mode: {
			text:  true,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	};

	assert(typeof Browser.isConfig, 'function');

	assert(Browser.isConfig(cfg1), false);
	assert(Browser.isConfig(cfg2), false);
	assert(Browser.isConfig(cfg3), true);
	assert(Browser.isConfig(cfg4), true);

});

describe('isConfig()', function(assert) {

	let cfg1 = {
		domain: null
	};

	let cfg2 = {
		domain: 'example.com',
		mode: {
			text: false
		}
	};

	let cfg3 = {
		domain: null,
		mode: {
			text:  true,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	};

	let cfg4 = {
		domain: 'example.com',
		mode: {
			text:  true,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	};

	assert(typeof isConfig, 'function');

	assert(isConfig(cfg1), false);
	assert(isConfig(cfg2), false);
	assert(isConfig(cfg3), true);
	assert(isConfig(cfg4), true);

});

describe('Browser.prototype.back()', function(assert) {

	assert(this.browser !== null);
	assert(this.browser.tab, null);

	assert(this.browser.show(this.tab),                       this.tab);
	assert(this.browser.navigate('https://two.example.com/'), true);
	assert(this.browser.tab,                                  this.tab);

	assert(this.browser.show(this.tab),                         this.tab);
	assert(this.browser.navigate('https://three.example.com/'), true);
	assert(this.browser.tab,                                    this.tab);

	assert(this.browser.back(),  true);
	assert(this.browser.tab.url, 'https://two.example.com/');

	assert(this.browser.back(),  true);
	assert(this.browser.tab.url, 'https://example.com/');

	assert(this.browser.back(),  false);
	assert(this.browser.tab.url, 'https://example.com/');

	assert(this.browser.tab.forget('stealth'), true);

});

describe('Browser.prototype.close()', function(assert) {

	assert(this.browser.tab,                     this.tab);
	assert(this.browser.tabs.length,             1);
	assert(this.browser.close(this.browser.tab), true);
	assert(this.browser.tab.url,                 'stealth:welcome');
	assert(this.browser.tabs.length,             1);

	let tab1 = this.browser.open('https://example.com/one.html');

	assert(this.browser.show(tab1),  tab1);
	assert(this.browser.tab,         tab1);
	assert(this.browser.tabs.length, 2);

	assert(this.browser.navigate('https://example.com/two.html'), true);
	assert(this.browser.tabs.length,                              2);
	assert(this.browser.close(this.browser.tab),                  true);

	let tab2 = this.browser.tab;

	assert(this.browser.tab,         tab2);
	assert(this.browser.tab.url,     'stealth:welcome');
	assert(this.browser.tabs.length, 1);

	assert(this.browser.show(this.tab), this.tab);
	assert(this.browser.close(tab2),    true);
	assert(this.browser.tab,            this.tab);
	assert(this.browser.tabs.length,    1);

});

describe('Browser.prototype.destroy()', function(assert) {

	let browser = new Browser({
		host: '127.0.0.1'
	});

	browser.once('connect', () => {
		assert(true);
	});

	browser.once('disconnect', () => {
		assert(true);
	});

	assert(browser.connect(), true);

	setTimeout(() => {
		assert(browser.destroy(), true);
	}, 100);

});

describe('Browser.prototype.disconnect()', function(assert) {

	let browser = new Browser({
		host: '127.0.0.1'
	});

	browser.once('connect', () => {
		assert(true);
	});

	browser.once('disconnect', () => {
		assert(true);
	});

	assert(browser.connect(), true);

	setTimeout(() => {
		assert(browser.disconnect(), true);
	}, 100);

});

describe('Browser.prototype.get()', function(assert) {

	this.browser.settings.modes = [{
		domain: 'example.com',
		mode: {
			text:  true,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	}];

	let cfg1 = this.browser.get('cookie.engineer');
	let cfg2 = this.browser.get('tholian.network');
	let cfg3 = this.browser.get('example.com');

	assert(cfg1.domain,     'cookie.engineer');
	assert(cfg1.mode.text,  false);
	assert(cfg1.mode.image, false);
	assert(cfg1.mode.audio, false);
	assert(cfg1.mode.video, false);
	assert(cfg1.mode.other, false);

	assert(cfg2.domain,     'tholian.network');
	assert(cfg2.mode.text,  false);
	assert(cfg2.mode.image, false);
	assert(cfg2.mode.audio, false);
	assert(cfg2.mode.video, false);
	assert(cfg2.mode.other, false);

	assert(cfg3.domain,     'example.com');
	assert(cfg3.mode.text,  true);
	assert(cfg3.mode.image, false);
	assert(cfg3.mode.audio, false);
	assert(cfg3.mode.video, false);
	assert(cfg3.mode.other, false);

	assert(this.browser.settings.modes.includes(cfg3), true);

});

describe('Browser.prototype.navigate()', function(assert, console) {

	assert(this.browser.tab,         this.tab);
	assert(this.browser.tabs.length, 1);

	console.log(this.browser.tabs);

});

describe('Browser.prototype.set()', function(assert) {

	this.browser.settings.modes = [{
		domain: 'example.com',
		mode: {
			text:  true,
			image: false,
			audio: false,
			video: false,
			other: false
		}
	}];

	let cfg1 = this.browser.get('cookie.engineer');
	let cfg2 = this.browser.get('tholian.network');
	let cfg3 = this.browser.get('example.com');

	assert(cfg1.domain,     'cookie.engineer');
	assert(cfg1.mode.text,  false);
	assert(cfg1.mode.image, false);
	assert(cfg1.mode.audio, false);
	assert(cfg1.mode.video, false);
	assert(cfg1.mode.other, false);

	assert(cfg2.domain,     'tholian.network');
	assert(cfg2.mode.text,  false);
	assert(cfg2.mode.image, false);
	assert(cfg2.mode.audio, false);
	assert(cfg2.mode.video, false);
	assert(cfg2.mode.other, false);

	assert(cfg3.domain,     'example.com');
	assert(cfg3.mode.text,  true);
	assert(cfg3.mode.image, false);
	assert(cfg3.mode.audio, false);
	assert(cfg3.mode.video, false);
	assert(cfg3.mode.other, false);

	assert(this.browser.set(cfg1), true);
	assert(this.browser.set(cfg2), true);
	assert(this.browser.set(cfg3), true);

	assert(this.browser.get('cookie.engineer'), cfg1);
	assert(this.browser.get('tholian.network'), cfg2);
	assert(this.browser.get('example.com'),     cfg3);

	assert(this.browser.settings.modes.includes(cfg1), true);
	assert(this.browser.settings.modes.includes(cfg2), true);
	assert(this.browser.settings.modes.includes(cfg3), true);

});

describe('Browser.prototype.is()', function(assert) {

	assert(this.browser.is('connected'), true);

});

after(disconnect_stealth);


export default finish('stealth/Browser');
