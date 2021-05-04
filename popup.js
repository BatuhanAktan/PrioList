const addBtn = document.querySelector('.navbttn');
const clearBtn = document.querySelector('.navbttnclear');
const orgBtn = document.querySelector('.navbttnro');

const puppeteer = require('puppeteer');

let importance = {"Health & Personal Care":1,"Amazon Device Accessories":3, "Amazon Kindle":3, "Automotive & Powersports":3,"Baby Products (excluding apparel)":1, "Beauty":3, "Books":3, "Camera & Photo":3,"Cell Phones & Accessories":3,"Collectible Coins":4,"Consumer Electronics":3,"Entertainment Collectibles":3,"Fine Art":4,"Grocery & Gourmet Food":1,"Health & Personal Care":1,"Home & Garden,Independent Design":3,"Industrial & Scientific":3,"Kindle Accessories and Amazon Fire TV Accessories":4,"Major Appliances":2,"Music":3,"Musical Instruments":3,"Office Products":2,"Outdoors":3,"Personal Computers":2,"Pet Supplies":2,"Software":2,"Sports":2,"Sports Collectibles":4,"Tools & Home Improvement":2,"Toys & Games":2,"Video":3, "DVD & Blu-ray":3,"Video Games":3,"Watches":4};

let list = [];

var info = [
{
	userid: 0,
	data: 0,
	url: "None"
}];
var id = 0;
chrome.storage.sync.get(['data'], function(result) {
		loadList(result.data);
		console.log("Result Has been changed "+ result.data);
	});


addBtn.onclick = ()=>{
	addList(id+1 , "New Item" , 12.25, "https://images-na.ssl-images-amazon.com/images/I/71-U4ZHnLAL._AC_SY355_.jpg", "Health & Personal Care");
	id++; 
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
	wshlist.innerHTML = ' ';
}


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
	itmImg.innerHTML = `<img class="productImg" src="${itemPicUrl}"alt="Product Image">`;
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
	list.forEach(function(item){
		addList(item.id, item.name, item.price, item.imgUrl);
	});
}

async function scrape(){
	var res = await fetch ('https://www.amazon.ca/Apple-AirPods-Charging-Latest-Model/dp/B07PXGQC1Q/?_encoding=UTF8&pd_rd_w=tqC1R&pf_rd_p=708c5fba-fb35-4548-a6c6-bccf7edf8384&pf_rd_r=F5KTHHKYJE0SC161554D&pd_rd_r=4a3c5ed3-8248-4634-b4b5-54e7f4b25827&pd_rd_wg=P8FkU&ref_=pd_gw_trq_ed')\
	var text = await res.text(/(?<span id="productTitle" class="a-size-large product-title-word-break">)(.*?)(?=<\/span>)/g);
	return text.match()
}
console.log(scrape())