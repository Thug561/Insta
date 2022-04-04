const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.instagram.com/';

const instagram = {
    browser: null,
    page: null,

    initialize: async () => {
        instagram.browser = await puppeteer.launch({
            headless: false
        });

        instagram.page = await instagram.browser.newPage();

       

    },

    login: async (username, password) =>{
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2'});
        let loginButton = await instagram.page.$x('//a[contains(text(), "Log in")]');


        /*Клик по кнопке логин*/
    //    await loginButton[0].click();
    //    await instagram.page.waitForNavigation({ waitUntil: 'networkidle2'});

    /*Вход логин и пароль*/
    await instagram.page.type('input[name="username"]', username, {delay: 50});
    await instagram.page.type('input[name="password"]', password, {delay: 50});

    /*клик по кнопке входа*/    
    loginButton = await instagram.page.$x('//button[contains(text(), "Log in")]');
    await loginButton[0].click();

    await instagram.page.waitFor(10000)
    await instagram.waitFor('a > span[aria-label="Profile"]');

        
    },

    likeTagsProcess = async (tags = []) => {
        for(let tag of tags) {
            /*переход на страницу тегов*/
            await instagram.page.goto(TAG_URL(tag), {waitUntil: 'networkidle2'});
            await instagram.page.waitFor(1000);

            let posts = await instagram.page.$$('article > div:nth-child(3) img[decoding="auto"]');

            for (let i = 0; i < 3; i++) {
                let post = posts[i];

                /*клик по посту*/
                await post.click();

                /*работа с окном поста*/
                await instagram.page.waitFor('span[id="react-root"][aria-hidden="true"]');
                await instagram.page.waitFor(1000);

                let isLikable = await instagram.page.$('span[aria-label="like"]');

                if(isLikable){
                    await instagram.page.click('span[aria-label="like"]');
                }

                await instagram.page.waitFor(3000);

                /*закрытие поста*/
                let closeModalButton = await instagram.page.$x('//button[contains(text(), "Close")]');
                await closeModalButton[0].click();

                await instagram.page.waitFor(1000);
            }
            /*переход к след. посту*/
            await instagram.page.waitFor(15000);
        }
    }
}

module.exports = instagram;