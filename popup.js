const addBtn = document.querySelector('.navbttn');
const clearBtn = document.querySelector('.navbttnclear');
const orgBtn = document.querySelector('.navbttnro');

let importance = {"Health & Personal Care":1,"Amazon Device Accessories":3, "Amazon Kindle":3, "Automotive & Powersports":3,"Baby Products (excluding apparel)":1, "Beauty":3, "Books":3, "Camera & Photo":3,"Cell Phones & Accessories":3,"Collectible Coins":4,"Consumer Electronics":3,"Entertainment Collectibles":3,"Fine Art":4,"Grocery & Gourmet Food":1,"Health & Personal Care":1,"Home & Garden,Independent Design":3,"Industrial & Scientific":3,"Kindle Accessories and Amazon Fire TV Accessories":4,"Major Appliances":2,"Music":3,"Musical Instruments":3,"Office Products":2,"Outdoors":3,"Personal Computers":2,"Pet Supplies":2,"Software":2,"Sports":2,"Sports Collectibles":4,"Tools & Home Improvement":2,"Toys & Games":2,"Video":3, "DVD & Blu-ray":3,"Video Games":3,"Watches":4};

let uid;

var info = [
{
	userid: 0,
	data: 0,
	url: "None"
}];
chrome.storage.sync.get(['id'], function(result) {
		currentId(result.id);
	});


addBtn.onclick = async ()=>{
	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
		let url = tabs[0].url;
		console.log("URL", url);
		const search = async (url) => {
			url  = {url};
			console.log("Trying Content");
			const content = await fetch('http://localhost:3001/prio', {
				method: 'POST',
				headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(url)
			});

			let returnContent = await content.json();
			console.log("returned Content");
			const o = async () => {

					let status = await JSON.parse(returnContent.status);
					console.log(status);
					try{
						if (parseInt(status) === 1){

							let title = await JSON.stringify(returnContent.title.title);
							title = title.slice(1,30) + "...";
							let price = await JSON.stringify(returnContent.price.price);
							price = price.slice(1,-1);
							let img  = await JSON.stringify(returnContent.img.img);
							let category = await JSON.stringify(returnContent.category.category);
							category = price.slice(1,-1);

							console.log("In response");
							console.log(img);
							addList(id, title, price, img, category);

						}else{
							console.log("Cannot Add");
						}
					}catch(error){
						console.log(error);
					}
			}

			o();
		}

		search(url);
	});
}

const currentId = async (id) => {
	if (id.length == 0){
		uid = await 
	}
}


orgBtn.onclick = ()=>{
	organize(list);
	chrome.storage.sync.set({data:list}, function(){
		console.log("Org Button "+ list);
	});

	let wshlist = document.getElementById("wishlist");
	wshlist.innerHTML = ' ';
	list = [];
	chrome.storage.sync.get(['data'], function(result) {
		loadList(result.data);
		console.log("Result Has been changed "+ result.data);
	});
}


clearBtn.onclick = ()=>{

	chrome.storage.sync.set({data:[]}, function(){
		console.log("Data is set to "+ []);
	});

	list=[];

	let wshlist = document.getElementById("wishlist");
	wshlist.innerHTML = '';
}

/*
function organize(orglist){
	let newlist = [];
	orglist.forEach(function(item){
		if (item['category'] in importance){
			console.log("In importance");
			item['importance'] = importance[item['category']];
		} else{
			item['importance'] = 5;
		}
	});
	for (var i = 1; i<=5; i++){
		orglist.forEach(function(item){
			if (item['importance'] === i){
				newlist.push(item);
			}
		});
	}
	list = newlist;
	newlist = [];
	console.log(newlist.length);
}

*/

function addList(ID, itemName, itemPrice, itemPicUrl, itemCat){


	console.log("Button Pressed");
	const newDiv = document.createElement("div");
	newDiv.addEventListener("click", function(event){
		const element = event.target;
		let itemID = element.parentNode.parentNode.id;
		element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
		var newList = [];
		list.forEach(function(item){
			if (item['ID'] = itemID){
				console.log("NewList" + item + "Old List" + list);
			}else{
				newList.push(item)

			}
		});
		organize(newList);
		chrome.storage.sync.set({data:newList}, function(){
		console.log("Inside Event Listener "+ newList);
		});
	});
	newDiv.classList.add("item");
	newDiv.id = ID;


	const itmImg = document.createElement("SPAN");
	itmImg.innerHTML = `<img class="productImg" src=${itemPicUrl}alt="Product Image">`;
	newDiv.appendChild(itmImg);


	const newItem = document.createElement("SPAN");
	newItem.innerHTML = itemName;
	newItem.href = "www.batuhanaktan.com";
	newItem.target = "_blank";
	newItem.classList.add("itemName");
	newDiv.appendChild(newItem);


	const itmPrice = document.createElement("SPAN");
	itmPrice.innerHTML = itemPrice;
	itmPrice.classList.add("price");
	newDiv.appendChild(itmPrice);

	const remBut = document.createElement("button");
	remBut.innerHTML= '<img src="./visuals/minus.png">';
	remBut.classList.add("removebttn");
	newDiv.appendChild(remBut);


	wishlist.appendChild(newDiv);


	list.push({
			ID: 'id',
			name: itemName,
			price: itemPrice,
			imgUrl: itemPicUrl,
			category: itemCat,
			importance: 0
	});

	chrome.storage.sync.set({data:list}, function(){
		console.log("End of Add "+ list);
	});
}


function loadList(list){
	if (list){
		list.forEach(function(item){
			addList(item.id, item.name, item.price, item.imgUrl);
		});
	}
}
