const ig = require('./instagram');

(async () => {

    await ig.initialize();

    await ig.login('alexsword561@gmail.com','11ddbb211');

    await ig.likeTagsProcess(['cars', 'carss']);
    
    debugger;

})()