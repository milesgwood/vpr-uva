//Polyfill since IE11 doesn't support startsWith
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
	'use strict';
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

//https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
	  'use strict';
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

(function ($, document, window) {
	
	'use strict';
	log("JS Loaded");
	$(document).ready(init);

	function init(e) {
//		prepare_static_news_items(e);
		get_dynamic_news_items(e);
		return;
	}
	
	function get_dynamic_news_items(){
		$.ajax({
		  url: 'https://api.rss2json.com/v1/api.json',
		  method: 'GET',
		  dataType: 'json',
		  data: {
			rss_url: 'https://us6.campaign-archive.com/feed?u=ad59b4c4385511a9ec177859c&id=16860b7f9e',
			api_key: 'ourf2jvebbdifvv8g98zaunzzdky69ciafk8fzig', // put your api key here
			count: 2
		  }
		}).done(function(response) {
		  if (response.status !== 'ok') {
			throw response.message;
		  }
		  
      //		  console.log(response);
      //This creates the news items but hides them as the RSS display is horrid
			var item = response.items[0];
			var fragment = create("<a href='" + item.link + "'><h3>" + item.title + "</h3></a><span>" + item.pubDate + "</span><p>" + item.content + "</p>");
			document.getElementById('rss_feed').appendChild(fragment);
			add_dynamic_news_items();
		});
	}
	
    function create(htmlStr) {
      var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
      temp.innerHTML = htmlStr;
      while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
      }
      return frag;
    }
	
	function add_dynamic_news_items(){	
		var news_body_real = find_the_real_news_bodies_by_length();
		var titles_real = find_real_news_titles();
		
		// Get the links to the articles directly
		var continue_reading = $('#rss_feed .mcnTextContent > div a');
		
		console.log("News Titles", titles_real);
		console.log("News Body Text", news_body_real);
		console.log("Read More Links", continue_reading);
		append_new_news_items(titles_real, news_body_real, continue_reading);
	}
	
	function find_real_news_titles(){
		var titles = $('strong');
		var titles_real = [];
		
		var temp_title = '';
		for (var t = 2; t < titles.length ; t++){
			if (titles[t].innerText.startsWith('\xa0'))
				{
				  	temp_title = titles_real.pop();
				  	temp_title = temp_title + titles[t].innerText;
					titles_real.push(temp_title);
				}
			else if(titles[t].innerText.endsWith('\xa0') && titles[t].innerText.startsWith('\xa0')){
				temp_title = titles_real.pop();
				temp_title = temp_title + titles[t+1].innerText;
				titles_real.push(temp_title);
				t++;
			}
			else if(titles[t].innerText.endsWith('\xa0') && (! titles[t].innerText.startsWith('\xa0'))){
				titles_real.push(titles[t].innerText + titles[t+1].innerText);
				t++;
			}
			else{
				titles_real.push(titles[t].innerText);
			}
		}
		
		titles_real = join_single_word_titles(titles_real);
		titles_real = remove_titles_with_less_than_2_words(titles_real);
		return titles_real;
	}
	
	
	//	Invalid News items start with non alphanumeric charecters
	function find_the_real_news_bodies_by_length(){
		var news_body = $('#rss_feed span');
		var news_body_real = [];
		for (var x = 0 ; x < news_body.length ; x++){
			if(news_body[x].innerText.length > 150){
				if(! news_body[x].innerHTML.startsWith("<") && 		
				   ! news_body[x].innerHTML.startsWith("(") &&
				   ! news_body[x].innerHTML.startsWith(" ")){
					news_body_real.push(news_body[x]);
				}
			}
		}
		return news_body_real;
	}
	
	function join_single_word_titles(possible_real_titles){
		var current_title;
		var next_title;
		var real_titles= [];
		
		for(var i = 0 ; i < possible_real_titles.length -1 ; i++){
			current_title = possible_real_titles[i];
			next_title = possible_real_titles[i+1];
			if((current_title.trim().split(" ").length) === 1){
				real_titles.push(current_title + " " + next_title);
				i++;
			}
			else{
				real_titles.push(current_title);
				//Add the last title if it wasn't added by already joined
				if(i === possible_real_titles.length -2)
				{
						real_titles.push(next_title);
				}
			}
		}
		return real_titles;
	}
	
	function remove_titles_with_less_than_2_words(possible_real_titles){
		var current_title;
		var real_titles= [];
		
		for(var i = 0 ; i < possible_real_titles.length -1 ; i++){
			current_title = possible_real_titles[i];
			if((current_title.trim().split(" ").length) > 2){
				real_titles.push(current_title);
			}
		}
		return real_titles;
	}
	var news_images = [
		"panu.header.jpg",
		"sponsored_research_2017.jpg",
    "sponsored_research_2017_0015_Bookstore_TexturalSS_24.jpg.jpg",
    "3-2_0007_nick-de-partee-97063.png",
    "3-2_0022_jungwoo-hong-100345.png",
    "3-2_0039_denys-nevozhai-191628.png",
    "3-2_0065_yaniv-knobel-120433.png",
    "3-2_0073_samuel-zeller-34751.png",
    "3-2-photos-batch3_0031_brent-de-ranter-426248.jpg",
    "site-photos_0017_diz-play-31367.jpg",
    "sponsored_research_2017_0006_christopher-burns-271403-unsplash.jpg",
    
  ];
	
	//Here we actually add the news items to the page.
	function append_new_news_items(titles, bodies, more_link){
		var number_of_articles = titles.length;
		number_of_articles = Math.min(number_of_articles, bodies.length);
		number_of_articles = Math.min(number_of_articles, more_link.length);
    console.log("More Links for News" , more_link)
		
		for(var i = 0 ; i < number_of_articles; i++){
			var news_item  = document.createElement("div");
			news_item.innerHTML = "<div class='row'><div class='col-sm-4'><a href='" + 
				more_link[i].href + 
				"'><img class='news-img' src='all-vpr-web/img/brand/sized-3-2/" + news_images[i % news_images.length] + "'/></a></div>"+
				"<div class='col-sm-8'><div class='news-title'><a class='news-link' href='" + more_link[i].href + "'><h5>" + 
				titles[i] + "</h5></a></div><p class='news'>" + 
				bodies[i].innerText + " <a href='"+ 
				more_link[i].href +"'>Read More</a></p></div></div>";
			$('#home-news').append(news_item);
		}
	}
	
	/**
	Truncates and adds Read More links to news items that are manually added to the page. No longer used for the homepage. Images are static still but the news is dynamic.
	*/
	function prepare_static_news_items(){
		var news = $('.news');
		var news_links = $('.news-link');
		
		for(var i = 0 ; i < news.length ; i++) {
			news[i].innerHTML = truncate_to_600(news[i].innerHTML);
			var temp_link = document.createElement("a");
			temp_link.href = news_links[i].href;
			temp_link.innerHTML = "Read More";
			news[i].appendChild(temp_link);
		}
		return;
	}
	
	
	function truncate_to_600(string){
		if (string.length > 600){ return (string.substring(0,600)+'... ');}
	   	else{ return string  + " ";}
	}
	
	    /**
     * Prints arguments to console.log if allowed
     */
    function log() {
        try {
            var args = [];
            for (var i = 0; i < arguments.length; i++){
                args[i] = arguments[i];
            }
            console.log("[cc_scripts]", arguments);
        } catch (err) {
        }
    }	
})(jQuery, document, window);

function show_all_news(){
	'use strict';
	jQuery('#home-news div:nth-child(1n+9)').css('display', "block");
	jQuery('#news-button').css('display', "none");
}