//set links
const links = [
  {"name": "Github", "url":"https://github.com/" }, 
    
    {"name": "HackerRank", "url":"https://www.hackerrank.com/"},
    
    {"name": "CloudFlare", "url":"https://www.cloudflare.com/"}

];

//use links inside Rewriter
class LinksTransformer{
  constructor(links){
    this.links= links
  }

  async element(element){
    element.setInnerContent(
      this.links.map(link => `<a href="${link.url}">${link.name}</a>`),{
        html: true
      }
    )
  }
}

//remove display
class RemoveDisplayNone {
  async element(element){
    element.removeAttribute('style')
  }
}

//add profile picture
class ImageTransformer {
  async element (element){
    element.setAttribute('src','https://scontent-dfw5-1.xx.fbcdn.net/v/t31.0-8/14409658_10154643275350555_7854678066763815718_o.jpg?_nc_cat=110&ccb=2&_nc_sid=a9b1d2&_nc_ohc=VT-CL6wNwkAAX86I8RH&_nc_ht=scontent-dfw5-1.xx&oh=f436f550aee4729babda08847646b016&oe=5FBD1EB8')
  }
}

class NameTransformer{
  async element(element){
    element.setInnerContent('Naomi Allen')
  }
}


//set up a request handler to respond to the path /links
//fetch and handle request
addEventListener('fetch', event =>{
  event.respondWith(handleRequest(event.request))
});

/**
@param {Request} request
*/

//json call
async function handleRequest(request){
  let url = new URL(request.url)
  let path = url.pathname
  if(path === '/links'){
    return new Response(JSON.stringify(links),{
      headers:{'content-type': 'application/json;charset=UTF-8'}
    })
  }else{
    //fetch static HTML
    const response = await fetch(
      'https://static-links-page.signalnerve.workers.dev',
    )
    return new HTMLRewriter()
    //remove display from profile div
    .on('div[id="profile"]', new RemoveDisplayNone())
    //set img avatar src to profile image
    .on('img[id="avatar"]', new ImageTransformer())
    //set text to username
    .on('h1[id="name"]', new NameTransformer())
    //use me links
    .on('div[id="links"]', new LinksTransformer(links))
    .transform(response)
  } 
}