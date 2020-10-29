function adCounterToTopNav(numberOfAds) {
  $("#nav-top ul li a.jobb").append(
    `<span class="nav-badge">${numberOfAds}</span>`
  );
}

function drawFooterContent(adsList, premiumAdsList, articles, tag) {
  var footerContent = $('<div class="footer-content row"></div>');
  var relatedArticlesElements = drawRelatedArticleElements(
    articles,
    tag,
    adsList,
    premiumAdsList
  );

  footerContent.append(relatedArticlesElements);
  $("main").after(footerContent);
}

function drawFrontArticleElements(articles, adsList, premiumAdsList) {
  var relatedArticles = $(
    '<div class="footer-content-related"><h3>Siste nytt</h3></div>'
  );

  var relatedArticlesWrapFirst = $('<div class="footer-content-wrap"></div>');
  var relatedArticlesWrapSecond = $(
    '<div class="footer-content-wrap two-col"></div>'
  );

  relatedArticlesWrapFirst.append(drawArticle(articles[2]));

  if (premiumAdsList.length > 1) {
    relatedArticlesWrapFirst.append(drawPremiumAd(premiumAdsList[1]));
  } else {
    relatedArticlesWrapFirst.append(drawPremiumAd(adsList[1]));
  }

  relatedArticlesWrapFirst.append(drawArticle(articles[3]));

  relatedArticlesWrapSecond.append(drawArticle(articles[0]));
  relatedArticlesWrapSecond.append(drawArticle(articles[1]));

  return relatedArticles.append(
    relatedArticlesWrapSecond,
    relatedArticlesWrapFirst
  );
}

function drawRelatedArticleElements(articles, tag, adsList, premiumAdsList) {
  var relatedArticles = $(
    '<div class="footer-content-related"><h3>Relaterte saker</h3></div>'
  );

  var relatedArticlesWrapFirst = $('<div class="footer-content-wrap"></div>');
  var relatedArticlesWrapSecond = $(
    '<div class="footer-content-wrap two-col"></div>'
  );
  var relatedArticlesWrapThird = $('<div class="footer-content-wrap"></div>');

  relatedArticlesWrapFirst.append(drawArticle(articles[2]));
  if (premiumAdsList.length) {
    relatedArticlesWrapFirst.append(drawPremiumAd(premiumAdsList[0]));
  } else {
    relatedArticlesWrapFirst.append(drawPremiumAd(adsList[0]));
  }

  relatedArticlesWrapFirst.append(drawArticle(articles[3]));

  relatedArticlesWrapSecond.append(drawArticle(articles[0]));
  relatedArticlesWrapSecond.append(drawArticle(articles[1]));

  if (articles.length >= 7) {
    relatedArticlesWrapThird.append(drawArticle(articles[4]));
    relatedArticlesWrapThird.append(drawArticle(articles[5]));
    relatedArticlesWrapThird.append(drawArticle(articles[6]));
  }

  return relatedArticles.append(
    relatedArticlesWrapSecond,
    relatedArticlesWrapFirst,
    relatedArticlesWrapThird
  );
}

function getTagsElements(tags, avoid) {
  var tagsElementContainer = $('<div class="article-tags"></div>');
  var tagsArray = tags.split(", ");
  tagsArray = tagsArray.filter((tag) => tag !== avoid);

  var max = tagsArray.length - 1 < 2 ? tagsArray.length - 1 : 2;

  for (var x = 0; x <= max; x++) {
    tagsElementContainer.append(
      `
        <span>${tagsArray[x]}</span>
      `
    );
  }
  return tagsElementContainer;
}

function drawArticle(article) {
  var tagsElement = getTagsElements(article.tags, article.section_tag);

  articleElement = $(`
            <a class="article article-link" href="//kode24.no${
              article.published_url
            }">
        <div class="article-image">
        ${
          article.images
            ? `<img alt="article image" src="${article.images[0].url_size}">`
            : `<img alt="article image" src="//dbstatic.no/${article.image}.jpg?width=600">`
        }
                    
                </div>
        <div class="text-content">
                    <h4>${article.title}</h4>
        </div>    
      </a>`);

  articleElement.find(".article-image").append(tagsElement);

  return articleElement;
}

function drawPremiumAd(premiumAd, compact) {
  var cities = getCitysFromTags(premiumAd.tags);
  var premiumAdElement = $(`
        <a class="premium-ad ad" href="//kode24.no${premiumAd.published_url}">
            ${
              compact
                ? ""
                : `<div class="ad-image"><img alt="ad image" src="//dbstatic.no/${premiumAd.image}.jpg?width=400"></div>`
            }
            
            <div class="ad-text">
            <div class="ad-company-logo"><img alt="byline image" src="https://dbstatic.no${
              premiumAd.full_bylines[0].imageUrl
            }"></div>
                    <h4>${premiumAd.full_bylines[0].firstname}</h4>
                    <h5>${premiumAd.title}</h5>
                    <h6>${premiumAd.subtitle}</h6>
            </div>
                            
        </a>`);

  var citiesElement = $('<p class="cities"></p>');
  cities.forEach(function (city) {
    citiesElement.append($("<span>" + city + "</span>"));
  });
  premiumAdElement.append(citiesElement);
  return premiumAdElement;
}

function drawRegularAd(ad, toggleIngress) {
  var cities = getCitysFromTags(ad.tags);
  var adElement = $(`
        <a class="ad" href="//kode24.no${ad.published_url}">
        <div class="ad-company-logo"><img alt="byline image" src="https://dbstatic.no${
          ad.full_bylines[0].imageUrl
        }"></div>
            </div>
            <h4>
                ${ad.full_bylines[0].firstname}&nbsp;
            </h4>
            <h5>${ad.title}</h5>
            ${toggleIngress ? `<h6>${ad.subtitle}</h6>` : ""} 
        </a>`);
  var citiesElement = $('<p class="cities"></p>');
  cities.forEach(function (city) {
    citiesElement.append($("<span>" + city + "</span>"));
  });

  adElement.append(citiesElement);
  return adElement;
}

function drawInArticleAd(ad) {
  var adElement = drawRegularAd(ad, true);
  var adContainerWrapper = $(
    '<div class="in-article-listing"><h3>Ledig stilling</h3></div>'
  );
  var adContainer = $('<div class="vacant-position"></div>').append(adElement);
  adContainerWrapper.append(adContainer);

  return adContainerWrapper;
}

function drawAdsInArticle(premiumAdsList, nonPremiumAdsList) {
  premiumAdsList = newShuffledArray(premiumAdsList);
  nonPremiumAdsList = newShuffledArray(nonPremiumAdsList);
  let adsList = premiumAdsList.length
    ? [
        ...premiumAdsList,
        ...premiumAdsList,
        ...premiumAdsList,
        ...premiumAdsList,
        ...premiumAdsList,
      ]
    : nonPremiumAdsList;
  adsList = adsList.map((ad) => drawInArticleAd(ad));

  let toggle = true;
  let adsCounter = 0;
  // loop through h2-tags and place ads
  $(".body-copy h2").each(function (index) {
    if (toggle) {
      let element = $(this);
      if (
        element.prev().is("figure") ||
        element.prev().is("article") ||
        element.prev().is("aside") ||
        element.prev().is("div") ||
        element.prev().hasClass("quotebox")
      )
        element.prev().before(adsList[adsCounter]);
      else element.before(adsList[adsCounter]);
      toggle = false;
      adsCounter++;
    } else {
      toggle = true;
    }
  });
}

function drawPremiumUnderByline(premiumAds) {
  var randomPremiumAd = getRandomItemFromArray(premiumAds);
  var premiumAdElement = drawPremiumAdElement(randomPremiumAd);
  var adContainerWrapper = $(
    '<div class="byline-listing"><h3>Ledig stilling</h3></div>'
  );
  var adContainer = $('<div class="premium"></div>').append(premiumAdElement);
  adContainerWrapper.append(adContainer);

  return adContainerWrapper;
}

function hasOverlap(x, y, x2, y2) {
  // is above element, but touches it in bottom
  if (x2 < x && y2 < y && y2 > x) {
    return true;
  }
  // is inside element
  if (x2 >= x && y2 <= y) {
    return true;
  }
  // element touhes in top
  if (x2 > x && y2 > y && x2 < y) {
    return true;
  }
  return false;
}

function adjustOverlap(timeoutTimer, callback) {
  setTimeout(function () {
    var fullWidthImages = $(".body-copy .full-bleed");
    fullWidthImages.each(function (index) {
      var imageOffsetTop = $(this).offset().top;
      var imageTotaltHeight = $(this).outerHeight(true);

      var asideContainers = $(".aside-desktop").children();
      asideContainers.each(function (index) {
        var containerOffsetTop = $(this).offset().top;
        var containerTotalHeight = $(this).outerHeight(true);
        // if it overlaps, there might be elements inside that we must move
        if (
          hasOverlap(
            imageOffsetTop,
            imageOffsetTop + imageTotaltHeight,
            containerOffsetTop,
            containerOffsetTop + containerTotalHeight
          )
        ) {
          $(this)
            .children()
            .each(function (index) {
              var childOffsetTop = $(this).offset().top;
              var childTotalHeight = $(this).outerHeight(true);
              if (
                hasOverlap(
                  imageOffsetTop,
                  imageOffsetTop + imageTotaltHeight,
                  childOffsetTop,
                  childOffsetTop + childTotalHeight
                )
              ) {
                $(this).css(
                  "margin-top",
                  imageOffsetTop + imageTotaltHeight - childOffsetTop
                );
              }
            });
        }
      });
    });

    if (callback) callback();
  }, timeoutTimer);
}

// All the code that needs to be initialised in articles
$(function () {
  // only run if article
  if ($(".article-entity").length) {
    // set timestap on top of article
    jQuery("time.published").timeago();

    // start the carousel at the bottom of articles
    initCarousel("main");

    // start the code highlighter
    hljs.initHighlightingOnLoad();
    hljs.initLineNumbersOnLoad();

    // add sponsor row
    drawSponsors($("main"));

    // true because we are on frontpage
    initBanner(false);

    // to avoid extra call to api
    // put all requests that use api in here
    getAds(function (ads) {
      adCounterToTopNav(ads.length);
      // create container for ads
      var asideContainer = getAside();

      // Get active premium ads from premium-frontpage and filter them out.
      getFrontArticles("premium/", false, function (premiumAds) {
        // Get ids of all active premium ads
        let filteredAdsList = premiumAds.map((ad) => ad.instance_of);
        // filter out non-premium ads
        var premiumAdsList = ads.filter(
          (ad) => filteredAdsList.indexOf(parseInt(ad.id)) > -1
        );
        // filter out premium ads
        var nonPremiumAdsList = ads.filter(
          (ad) => filteredAdsList.indexOf(parseInt(ad.id)) == -1
        );

        // draw ads
        var adsContainer = drawAdsContainer(
          newShuffledArray(nonPremiumAdsList),
          newShuffledArray(premiumAdsList)
        );
        // add them to the dom

        // if we are on mobile add premium ad under byline
        drawAdsInArticle(premiumAdsList, nonPremiumAdsList);
        if (
          window.screen.width <= 640 &&
          window.location.pathname.indexOf("/jobb/") < 0 &&
          premiumAdsList.length
        ) {
          //drawPremiumUnderByline(getRandomItemFromArray(premiumAdsList));
        } else {
          asideContainer.append(adsContainer);
        }

        // when sidebar has been drawn
        adjustOverlap(4000);
        setTimeout(adjustAdsToFitBodyHeight, 1000);

        $(window).resize(function () {
          asideContainer.html("");
          asideContainer.append(
            drawAdsContainer(
              newShuffledArray(nonPremiumAdsList),
              newShuffledArray(premiumAdsList)
            )
          );
          // when sidebar has been drawn
          adjustOverlap(4000);
        });

        // if job-article, check for for e-mail
        getArticle(function (article) {
          let jobMail = getJobMail(article);
          if (jobMail) {
            drawQuickJobApplicationForm(
              jobMail,
              article.title,
              article.published_url
            );
          }
          // drawing footer
          getArticlesByTag(article, function (articles, tag) {
            getFrontArticles("", true, function (frontArticles) {
              getContentAds(function (contentAds) {
                $(".body-copy").parent().append(asideContainer);

                drawFooterContent(
                  nonPremiumAdsList,
                  premiumAdsList,
                  articles,
                  tag,
                  frontArticles,
                  contentAds
                );
              });
            });
          });
        });
      });
    });
  }
});

function initCarousel(selector, isfront) {
  var ads = [];
  var autoJobcarouselContainer = $(`<div class="row"></div>`);
  var autoJobcarousel = $(`<div class="auto-job-carousel"></div>`);
  var selector = selector instanceof jQuery ? selector : $(selector);

  $.ajax({
    type: "GET",
    url:
      "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+NOT+hidefromfp_time:[*+TO+NOW]+AND+visibility_status:P+AND+section:jobb&site_id=207&limit=2000",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    success: function (data) {
      var ads = data.result.filter((ad) => ad.visibility_status !== "H");
      shuffleArray(ads);
      adNodesToCarousel(
        ads,
        selector,
        autoJobcarousel,
        autoJobcarouselContainer
      );
    },
  });
}

function adNodesToCarousel(
  ads,
  selector,
  autoJobcarousel,
  autoJobcarouselContainer
) {
  let adsContainer = $('<div class="job-carousel-wrapper"></div>');
  ads.forEach(function (ad) {
    adsContainer.append(`
        <article id="${ad.id}">
        <a itemprop="url" href="${ad.published_url}">
            <figure class="image-contain" style="background-image: url(https://dbstatic.no/${ad.image}.jpg?imageid=${ad.image}&height=300&compression=80)">
            </figure>
            <div class="carousel article-preview-text">
                <div class="carousel-ad-byline">
                    <div class="carousel-ad-company-logo" style="background-image: url(https://dbstatic.no${ad.full_bylines[0].imageUrl})">
                    </div>
                    <h4>${ad.full_bylines[0].firstname}</h4>
                </div>
                <h1 class="headline">
                    ${ad.title}
                </h1>
            </div>
        </a>
        </article>
    `);
  });

  autoJobcarousel.append(adsContainer);
  autoJobcarousel.append(`
    <a href="/jobb" class="more-jobs"><span>Se alle ledige stillinger (${ads.length})</span></a>
    `);
  selector.after(autoJobcarouselContainer.append(autoJobcarousel));

  if (
    autoJobcarousel &&
    parseInt(autoJobcarousel.css("width").replace("px", "")) > 640
  ) {
    adsContainer.slick({
      infinite: true,
      speed: 300,
      autoplay: true,
      autoplaySpeed: 1500,
      slidesToShow: 3,
      centerMode: true,
      arrows: true,
      accessibility: true,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            arrows: false,
          },
        },
      ],
    });
  }
}

function initPremium(selector, rows) {
  cleanEmptyRows(() => {
    getFrontPremiumBanners(function (banners, jobDocuments) {
      if (banners.length) {
        shuffleArray(banners);
        var elements = getElements(selector, rows);
        elements.forEach((element, index) => {
          if (rows[index].type === "premium" && banners.length) {
            let banner = banners.pop();
            drawPremium(banner, elements[index], selector, jobDocuments);
          }

          if (rows[index].type === "carousel") {
            initCarousel(elements[index]);
          }
          // Adding the sponsor row
          if (index === 0) {
            drawSponsors(element.prev());
          }
        });
      }
    });
  });
}

function getElements(selector, rows) {
  selector = $(selector);
  var elements = [];
  for (var x = 0; x <= rows.length - 1; x++) {
    elements.push(selector.find(".row").has("*").eq(rows[x].row));
  }

  return elements;
}

function getItemFromArray(array, match) {
  for (let x = 0; x < array.length - 1; x++) {
    if (array[x].indexOf(match) > -1) {
      return array[x].split(match)[1];
    }
  }
  return false;
}

function cleanEmptyRows(callback) {
  $(".row").each((index, row) => {
    if ($(row).children().length < 1) {
      $(row).addClass("empty");
    }
  });

  callback();
}

function getRatio(url) {
  var props = props.split("&");
  var whRatio = getItemFromArray(props, "whRatio=");
  var whRatio = getItemFromArray(props, "whRatio=");
}

function drawPremium(banner, element, parent, jobDocuments) {
  parent = $(parent);

  var id = 0;
  var wratio = 0.53861386138614;
  var cropw = 100;
  var croph = 80.712166172107;
  var posy = 0;
  var posx = 0;
  var imageId = 0;
  var kicker = "";
  var url = "";
  var title = "";
  var subTitle = "";
  var fontSize = 38;
  var mobileFontSize = 29;
  var textAlign = "";

  var imageWidth = parent.width();
  var containerWidth = imageWidth;
  var companyImageUrl = "";
  var companyName = "";

  if (banner && banner.children[0] && banner.children[0].data) {
    id = banner.children[0].data.articleId || id;
    kicker = banner.children[0].data.kicker || kicker;
    url =
      "https://www.kode24.no" + banner.children[0].data.published_url || url;
    title = banner.children[0].data.title || "";
    subTitle = banner.children[0].data.subtitle || "";

    let viewPorts =
      banner.children[0].data.viewports_json &&
      banner.children[0].data.viewports_json.length > 0
        ? JSON.parse(banner.children[0].data.viewports_json)
        : {};

    if (
      banner.children[0].data.children &&
      banner.children[0].data.children.image
    ) {
      if (banner.children[0].data.children.image.field) {
        wratio = banner.children[0].data.children.image.field.whRatio || wratio;
        cropw = banner.children[0].data.children.image.field.cropw || cropw;
        croph = banner.children[0].data.children.image.field.croph || croph;
        posy = banner.children[0].data.children.image.field.y || posy;
        posx = banner.children[0].data.children.image.field.x || posx;

        if (imageWidth < 500) {
          let mobileViewport =
            JSON.parse(
              banner.children[0].data.children.image.field.viewports_json
            ) || {};
          imageWidth = 600;
          cropw = mobileViewport.mobile.fields.cropw || 53;
          croph = mobileViewport.mobile.fields.croph || 100;
          posx = mobileViewport.mobile.fields.x || 0;
          posy = mobileViewport.mobile.fields.y || 0;
          wratio =
            mobileViewport &&
            mobileViewport.mobile &&
            mobileViewport.mobile.fields &&
            mobileViewport.mobile.fields.whRatio
              ? mobileViewport.mobile.fields.whRatio
              : 1.246875;
          mobileFontSize =
            viewPorts &&
            viewPorts.mobile &&
            viewPorts.mobile.fields.title_style_json &&
            viewPorts.mobile.fields.title_style_json.text_size
              ? viewPorts.mobile.fields.title_style_json.text_size
              : 29;
        }
      }
      if (
        banner.children[0].data.children &&
        banner.children[0].data.children.image.attribute
      ) {
        imageId =
          banner.children[0].data.children.image.attribute.instanceof_id || 0;
      }
    }

    if (banner.children[0].data.title_style_json) {
      let titleStyles = JSON.parse(banner.children[0].data.title_style_json);

      fontSize = titleStyles.text_size || "";
      textAlign = titleStyles.text_align || "";
    }
  }

  if (jobDocuments[id]) {
    companyName = jobDocuments[id].full_bylines[0].firstname;
    companyImageUrl = jobDocuments[id].full_bylines[0].imageUrl;
  }

  if (title.indexOf("headline-title-wrapper") <= -1) {
    title = `<span class="headline-title-wrapper">${title}</span>`;
  }

  var bannerElement = `

        <div class="row top-listing" style="margin-top: 20px; margin-bottom: 30px;">
            <article id="article_${id}" class="preview   columns large-12 small-12 medium-12 native-advertisement" itemscope="" itemprop="itemListElement" itemtype="http://schema.org/ListItem" role="article" data-id="${
    banner.id
  }" data-label="">
                <a itemprop="url" href="${url}">
                    <div class="kicker">${kicker}</div> 
                    <figure id="${imageId}" style="width: ${containerWidth}px; padding-bottom: ${
    wratio * 100
  }%;">
                        <img class="" itemprop="image" alt="logo" src="//dbstatic.no/${imageId}.jpg?imageId=${imageId}&x=${posx}&y=${posy}&cropw=${cropw}&croph=${croph}&width=${imageWidth}&height=${Math.round(
    imageWidth * wratio
  )}&compression=80">
                    </figure><div class="article-preview-text">`;

  if (companyName && companyImageUrl) {
    bannerElement += `
                                <div class="company-information">
                                    <figure class="image-contain">
                                        <img alt="logo" src="//dbstatic.no${companyImageUrl}">
                                    </figure>
                                    <span>${companyName}</span>
                                 </div>
                                `;
  }

  if (title && typeof title === "string") {
    bannerElement += `
                                
                                    <h1 class="headline large-size-${fontSize} text-${textAlign} small-size-${mobileFontSize}">
                                        ${title}   
                                    </h1>
                                    <p class="standfirst text-${textAlign}">${subTitle}</p>
                                    <div class="labels">
                                    </div>
                                    <span class="label-text"></span>
                                 
                                `;
  }

  bannerElement += `</div></a>
            </article>
        </div>
    `;
  element.before(bannerElement);
  return element;
}

function getFrontPremiumBanners(callback) {
  getUrl("//api.kode24.no/front/?query=id:70267311", function (data) {
    getUrl(
      "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+NOT+hidefromfp_time:[*+TO+NOW]+AND+visibility_status:P+AND+section:jobb&site_id=207&limit=2000",
      function (jobDocumentsResponse) {
        let rows = data.result[0].content["lab-dz-1"];
        let jobDocuments = {};
        jobDocumentsResponse.result.map((job) => {
          jobDocuments[job.id] = job;
        });

        if (rows.length > 1) {
          callback(rows.slice(1), jobDocuments);
        } else {
          callback([], {});
        }
      }
    );
  });
}

function getUrl(url, callback) {
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    success: function (data) {
      callback(data);
    },
  });
}

// Should always be drawn

// On front it is added in drawPremium,

function drawSponsors(elementToAppendTo) {
  $.get("https://functions.kode24.no/api/sponsors", function (data) {
    const silverSponsors = data.silver;
    const goldSponsors = data.gold;

    let sponsorWrapper = $(`
    <div id="sponsors">
        <div id="sponsor-content">
            <ul id="gold-sponsors">
            </ul>
            <ul id="silver-sponsors">
            </ul>
            <div id="sponsor-call-to-action">
                <h2>Vil dere støtte Norges eneste nettavis for utviklere? 🤞</h2>
                <p>Bli sølv- eller gullpartner <a href="https://www.patreon.com/kode24" target="new_window">gjennom vår Patreon</a>, 
                og få god eksponering på kode24.no, 
                i podcasten vår kode24-timen og i vårt ukentlige nyhetsbrev! Bare ta kontakt på <a href="mailto:hei@kode24.no">hei@kode24.no</a> hvis du har spørsmål - og tusen takk til alle som støtter oss allerede.</p>
            </div>
        </div>
    </div>
    `);
    let silverSponsorsWrapper = sponsorWrapper.find("#silver-sponsors");
    silverSponsors.forEach((sponsor) => {
      let sponsorRow = $(`<li>
        <a href="${sponsor.url}" target="new_window"><img src="${sponsor.logo}" alt="${sponsor.name}"></a>
      </li>`);
      silverSponsorsWrapper.append(sponsorRow);
    });
    let goldSponsorsWrapper = sponsorWrapper.find("#gold-sponsors");
    goldSponsors.forEach((sponsor) => {
      let sponsorRow = $(`<li>
        <a href="${sponsor.url}" target="new_window"><img src="${sponsor.logo}" alt="${sponsor.name}">
        <span>${sponsor.message}</span>
        </a>
      </li>`);
      goldSponsorsWrapper.append(sponsorRow);
    });
    elementToAppendTo.append(sponsorWrapper);
  });
}

// the scripts that run on the front page

$(function () {
  // add inn premium ads in the news mix on the front page

  // only run if not in article
  if (!$(".article-entity").length) {
    // lazyload

    // true because we are on frontpage
    initBanner(true);

    initPremium("#front-articles-list", [
      { type: "premium", row: 3 },
      { type: "premium", row: 5 },
      { type: "carousel", row: 7 },
      { type: "premium", row: 9 },
      { type: "premium", row: 11 },
      { type: "premium", row: 13 },
      { type: "premium", row: 15 },
      { type: "premium", row: 17 },
      { type: "premium", row: 19 },
      { type: "premium", row: 21 },
      { type: "premium", row: 23 },
      { type: "premium", row: 25 },
    ]);

    // don't show sidebar on job and search site
    if (
      window.location.pathname.indexOf("jobb") > -1 ||
      window.location.pathname.indexOf("sok") > -1
    ) {
      $(".frontpage").removeClass("wide");
    } else {
      getAds(function (ads) {
        // done here to avoid an additional ads-call
        adCounterToTopNav(ads.length);
        // Get active premium ads from premium-frontpage and filter them out.
        getFrontArticles("premium/", false, function (premiumAds) {
          // Get ids of all active premium ads
          let filteredAdsList = premiumAds.map((ad) => ad.instance_of);
          // filter out non-premium ads
          var premiumAdsList = ads.filter(
            (ad) => filteredAdsList.indexOf(parseInt(ad.id)) > -1
          );
          // filter out premium ads
          var nonPremiumAdsList = ads.filter(
            (ad) => filteredAdsList.indexOf(parseInt(ad.id)) == -1
          );
          // create container for ads
          var asideContainer = getAside();
          // draw ads
          var adsContainer = drawAdsContainer(
            newShuffledArray(nonPremiumAdsList),
            newShuffledArray(premiumAdsList)
          );
          // add them to the dom
          asideContainer.append(adsContainer);
          $("#desktop-sidemenu-front").append(asideContainer);
        });
      });
    }
  }
});

$(function() {
  $("#signup-form").on("submit", event => {
    event.preventDefault();
    event.stopPropagation();
    let name = $("#newsletter-signup-name").val();
    let email = $("#newsletter-signup-email").val();
    if (name === "" || email === "") {
      alert("Tom e-post eller name");
    } else {
      $.post(
        "https://functions.kode24.no/api/email",
        {
          name: name,
          email: email
        },
        () => {
          $("#newsletter-form-submit-button").addClass("hide");
          $("#newsletter-form-submit-thank-you-message").addClass("show");
        }
      );
    }
  });
});

/**
 * The point of this function is to hide overshooting ads in the right
 * column on desktop, so that the right column is not taller than
 * the content of the article.
 */

/** 
Get offset of bottom of last element in body container.
Loop through elements in ads aside listing except the button,
and hide all elements that have higher bottom offset then the last element in the body container.
**/

function adjustAdsToFitBodyHeight() {
  var lastItem = $(".body-copy").children(":last-child");

  lastItemOffset = lastItem.offset().top;

  var lastItemHeight = lastItem.outerHeight(true);

  var textBodyOffset = lastItem.parent().offset().top;

  var offsetHeight = lastItemOffset + lastItemHeight;

  $(".aside-container .premium-ad").each(function () {
    var element = $(this);
    if (element.outerHeight(true) + element.offset().top > offsetHeight) {
      element.hide();
    }
  });
  $(".aside-container .regular-ad .ad").each(function () {
    var element = $(this);
    if (element.outerHeight(true) + element.offset().top > offsetHeight) {
      element.hide();
    }
  });
}

// lets images expand
$(() => {
  $("figure[data-image-lightbox]").on("click", event => {
    event.stopPropagation();
    event.preventDefault();

    let el = $(event.target);

    // somehow it becomes the child when clicked
    if (!el[0].hasAttribute("data-options")) el = el.parent();

    if (!el.hasClass("active")) {
      let imageUrl = el.attr("data-options").replace("src:", "");
      el.css("background-image", `url(${imageUrl})`);
      el.css("background-size", `contain`);
    } else {
      el.css("background-size", `0`);
    }
    el.toggleClass("active");
  });
});

// code that is reused across multiple files
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
}

function newShuffledArray(array) {
  let newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // eslint-disable-line no-param-reassign
  }
  return newArray;
}

function getAds(callback) {
  getUrl(
    "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+NOT+hidefromfp_time:[*+TO+NOW]+AND+visibility_status:P+AND+section:jobb&site_id=207&limit=2000",
    function (data) {
      var ads = data.result.filter((ad) => ad.visibility_status !== "H");
      callback(ads);
    }
  );
}

// returns a div with the correct aside class
function getAside() {
  return $("<div></div>").addClass("aside-desktop");
}

function getFrontArticles(front, filterContentMarketing, callback) {
  getUrl("//www.kode24.no/" + front + "?lab_viewport=json", function (data) {
    var articles = [];
    if (filterContentMarketing) {
      articles = data.result.filter(function (article) {
        return article.isContentMarketing !== "1";
      });
    } else {
      articles = data.result;
    }
    callback(articles);
  });
}

function getContentAds(callback) {
  getUrl(
    "//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+visibility_status:P+AND+section:annonse&limit=10&orderBy=published&site_id=207",
    function (data) {
      var contentAds = data.result.filter(
        (ad) => ad.tags.indexOf("content") > -1
      );
      callback(contentAds);
    }
  );
}

function getArticle(callback) {
  var articleId = getArticleId();
  getUrl("//api.kode24.no/article/?query=id:" + articleId, function (data) {
    callback(data.result[0]);
  });
}

function getJobMail(article) {
  if (article.section_tag === "jobb") {
    let tags = article.tags.trim().split(",");
    let jobbmail = tags.find((tag) => tag.includes("jobbmail"));
    if (jobbmail) return jobbmail.replace("jobbmail:", "").trim();
  }

  return false;
}

function getArticlesByTag(article, callback) {
  var tag = article.section_tag;
  getUrl(
    '//api.kode24.no/article/?query=published:[2017-01-01T00:00:00Z+TO+NOW]+AND+visibility_status:P+AND+section:"' +
      tag +
      '"&limit=10&orderBy=published&site_id=207',
    function (data) {
      callback(data.result, tag);
    }
  );
}

function getArticleId() {
  var articleUrl = "";
  if ($(".article-entity meta:first").attr("content").length) {
    articleUrl = $(".article-entity meta:first").attr("content");
  } else {
    var articleUrl = window.location.href;
  }
  var articleUrl = articleUrl.split("?")[0];
  var articleList = articleUrl.split("/").filter((val) => val !== "");
  var articleId = articleList[articleList.length - 1];
  return articleId;
}
function getCitysFromTags(tags) {
  tags = tags.split(",");
  var foundCities = [];
  var cities = [
    "Halden",
    "Moss",
    "Sarpsborg",
    "Fredrikstad",
    "Hvaler",
    "Aremark",
    "Marker",
    "Rømskog",
    "Trøgstad",
    "Spydeberg",
    "Askim",
    "Eidsberg",
    "Skiptvet",
    "Rakkestad",
    "Råde",
    "Rygge",
    "Våler",
    "Hobøl",
    "Vestby",
    "Ski",
    "Ås",
    "Frogn",
    "Nesodden",
    "Oppegård",
    "Bærum",
    "Asker",
    "Aurskog-Høland",
    "Sørum",
    "Fet",
    "Rælingen",
    "Enebakk",
    "Lørenskog",
    "Skedsmo",
    "Nittedal",
    "Gjerdrum",
    "Ullensaker",
    "Nes",
    "Eidsvoll",
    "Nannestad",
    "Hurdal",
    "Oslo",
    "Kongsvinger",
    "Hamar",
    "Ringsaker",
    "Løten",
    "Stange",
    "Nord-Odal",
    "Sør-Odal",
    "Eidskog",
    "Grue",
    "Åsnes",
    "Våler",
    "Elverum",
    "Trysil",
    "Åmot",
    "Stor-Elvdal",
    "Rendalen",
    "Engerdal",
    "Tolga",
    "Tynset",
    "Alvdal",
    "Folldal",
    "Os",
    "Lillehammer",
    "Gjøvik",
    "Dovre",
    "Lesja",
    "Skjåk",
    "Lom",
    "Vågå",
    "Nord-Fron",
    "Sel",
    "Sør-Fron",
    "Ringebu",
    "Øyer",
    "Gausdal",
    "Østre Toten",
    "Vestre Toten",
    "Jevnaker",
    "Lunner",
    "Gran",
    "Søndre Land",
    "Nordre Land",
    "Sør-Aurdal",
    "Etnedal",
    "Nord-Aurdal",
    "Vestre Slidre",
    "Øystre Slidre",
    "Vang",
    "Drammen",
    "Kongsberg",
    "Ringerike",
    "Hole",
    "Flå",
    "Nes",
    "Gol",
    "Hemsedal",
    "Ål",
    "Hol",
    "Sigdal",
    "Krødsherad",
    "Modum",
    "Øvre Eiker",
    "Nedre Eiker",
    "Lier",
    "Røyken",
    "Hurum",
    "Flesberg",
    "Rollag",
    "Nore og Uvdal",
    "Horten",
    "Tønsberg",
    "Sandefjord",
    "Svelvik",
    "Larvik",
    "Sande",
    "Holmestrand",
    "Re",
    "Færder",
    "Porsgrunn",
    "Skien",
    "Notodden",
    "Siljan",
    "Bamble",
    "Kragerø",
    "Drangedal",
    "Nome",
    "Bø",
    "Sauherad",
    "Tinn",
    "Hjartdal",
    "Seljord",
    "Kviteseid",
    "Nissedal",
    "Fyresdal",
    "Tokke",
    "Vinje",
    "Risør",
    "Grimstad",
    "Arendal",
    "Gjerstad",
    "Vegårshei",
    "Tvedestrand",
    "Froland",
    "Lillesand",
    "Birkenes",
    "Åmli",
    "Iveland",
    "Evje og Hornnes",
    "Bygland",
    "Valle",
    "Bykle",
    "Kristiansand",
    "Mandal",
    "Farsund",
    "Flekkefjord",
    "Vennesla",
    "Songdalen",
    "Søgne",
    "Marnardal",
    "Åseral",
    "Audnedal",
    "Lindesnes",
    "Lyngdal",
    "Hægebostad",
    "Kvinesdal",
    "Sirdal",
    "Eigersund",
    "Sandnes",
    "Stavanger",
    "Haugesund",
    "Sokndal",
    "Lund",
    "Bjerkreim",
    "Hå",
    "Klepp",
    "Time",
    "Gjesdal",
    "Sola",
    "Randaberg",
    "Forsand",
    "Strand",
    "Hjelmeland",
    "Suldal",
    "Sauda",
    "Finnøy",
    "Rennesøy",
    "Kvitsøy",
    "Bokn",
    "Tysvær",
    "Karmøy",
    "Utsira",
    "Vindafjord",
    "Bergen",
    "Etne",
    "Sveio",
    "Bømlo",
    "Stord",
    "Fitjar",
    "Tysnes",
    "Kvinnherad",
    "Jondal",
    "Odda",
    "Ullensvang",
    "Eidfjord",
    "Ulvik",
    "Granvin",
    "Voss",
    "Kvam",
    "Fusa",
    "Samnanger",
    "Os",
    "Austevoll",
    "Sund",
    "Fjell",
    "Askøy",
    "Vaksdal",
    "Modalen",
    "Osterøy",
    "Meland",
    "Øygarden",
    "Radøy",
    "Lindås",
    "Austrheim",
    "Fedje",
    "Masfjorden",
    "Flora",
    "Gulen",
    "Solund",
    "Hyllestad",
    "Høyanger",
    "Vik",
    "Balestrand",
    "Leikanger",
    "Sogndal",
    "Aurland",
    "Lærdal",
    "Årdal",
    "Luster",
    "Askvoll",
    "Fjaler",
    "Gaular",
    "Jølster",
    "Førde",
    "Naustdal",
    "Bremanger",
    "Vågsøy",
    "Selje",
    "Eid",
    "Hornindal",
    "Gloppen",
    "Stryn",
    "Molde",
    "Ålesund",
    "Kristiansund",
    "Vanylven",
    "Sande",
    "Herøy",
    "Ulstein",
    "Hareid",
    "Volda",
    "Ørsta",
    "Ørskog",
    "Norddal",
    "Stranda",
    "Stordal",
    "Sykkylven",
    "Skodje",
    "Sula",
    "Giske",
    "Haram",
    "Vestnes",
    "Rauma",
    "Nesset",
    "Midsund",
    "Sandøy",
    "Aukra",
    "Fræna",
    "Eide",
    "Averøy",
    "Gjemnes",
    "Tingvoll",
    "Sunndal",
    "Surnadal",
    "Rindal",
    "Halsa",
    "Smøla",
    "Aure",
    "Bodø",
    "Narvik",
    "Bindal",
    "Sømna",
    "Brønnøy",
    "Vega",
    "Vevelstad",
    "Herøy",
    "Alstahaug",
    "Leirfjord",
    "Vefsn",
    "Grane",
    "Hattfjelldal",
    "Dønna",
    "Nesna",
    "Hemnes",
    "Rana",
    "Lurøy",
    "Træna",
    "Rødøy",
    "Meløy",
    "Gildeskål",
    "Beiarn",
    "Saltdal",
    "Fauske",
    "Sørfold",
    "Steigen",
    "Hamarøy",
    "Tysfjord",
    "Lødingen",
    "Tjeldsund",
    "Evenes",
    "Ballangen",
    "Røst",
    "Værøy",
    "Flakstad",
    "Vestvågøy",
    "Vågan",
    "Hadsel",
    "Bø",
    "Øksnes",
    "Sortland",
    "Andøy",
    "Moskenes",
    "Harstad",
    "Tromsø",
    "Kvæfjord",
    "Skånland",
    "Ibestad",
    "Gratangen",
    "Lavangen",
    "Bardu",
    "Salangen",
    "Målselv",
    "Sørreisa",
    "Dyrøy",
    "Tranøy",
    "Torsken",
    "Berg",
    "Lenvik",
    "Balsfjord",
    "Karlsøy",
    "Lyngen",
    "Storfjord",
    "Kåfjord",
    "Skjervøy",
    "Nordreisa",
    "Kvænangen",
    "Vardø",
    "Vadsø",
    "Hammerfest",
    "Kautokeino",
    "Alta",
    "Loppa",
    "Hasvik",
    "Kvalsund",
    "Måsøy",
    "Nordkapp",
    "Porsanger",
    "Karasjok",
    "Lebesby",
    "Gamvik",
    "Berlevåg",
    "Tana",
    "Nesseby",
    "Båtsfjord",
    "Sør-Varanger",
    "Trondheim",
    "Steinkjer",
    "Namsos",
    "Hemne",
    "Snillfjord",
    "Hitra",
    "Frøya",
    "Ørland",
    "Agdenes",
    "Bjugn",
    "Åfjord",
    "Roan",
    "Osen",
    "Oppdal",
    "Rennebu",
    "Meldal",
    "Orkdal",
    "Røros",
    "Holtålen",
    "Midtre Gauldal",
    "Melhus",
    "Skaun",
    "Klæbu",
    "Malvik",
    "Selbu",
    "Tydal",
    "Meråker",
    "Stjørdal",
    "Frosta",
    "Levanger",
    "Verdal",
    "Verran",
    "Namdalseid",
    "Snåsa",
    "Lierne",
    "Røyrvik",
    "Namsskogan",
    "Grong",
    "Høylandet",
    "Overhalla",
    "Fosnes",
    "Flatanger",
    "Vikna",
    "Nærøy",
    "Leka",
    "Inderøy",
    "Indre Fosen",
  ];
  tags.forEach(function (tag) {
    tag = tag.replace(/ /g, ""); // trim whitespace
    cities.forEach(function (city, index) {
      if (tag == city.toLowerCase()) foundCities.push(city);
    });
  });
  return foundCities;
}

function cleanSectionTag(sectionTag) {
  sectionTag = sectionTag.replace(/ /g, "-");
  return sectionTag;
}

function getUrl(url, callback) {
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    success: function (data) {
      callback(data);
    },
  });
}

function drawContentAd(contentAds) {
  if (contentAds.length) {
    var contentAd = contentAds[0]; // pick the first one for now
    var adsContainer = $(
      '<div class="aside-container ads"><h3>Anonsørinnhold</h3></div>'
    );
    var contentAdElement = $(`<a class="premium-ad content-ad ad" href="//kode24.no${contentAd.published_url}">
                <div class="ad-image"><img alt="logo" src="//dbstatic.no/${contentAd.image}.jpg?width=400"></div>
                <div class="ad-text">
                    <div class="ad-company-logo"><img alt="logo" src="https://dbstatic.no${contentAd.full_bylines[0].imageUrl}"></div>
                    <h4>${contentAd.full_bylines[0].firstname}</h4>
                    <h5>${contentAd.title}</h5>
                    <h6>${contentAd.subtitle}</h6>
                </div>
                
            </a>`);
    adsContainer.append(contentAdElement);
    return adsContainer;
  } else {
    return "";
  }
}

function drawAdsContainer(adsList, premiumAdsList) {
  /** Draw ads-container */
  var adsContainer = $(
    '<div class="aside-container ads"><h3>Ledige stillinger</h3></div>'
  );
  // if there are any premium ads

  if (premiumAdsList.length) {
    var premiumAdElements = premiumAdsList.map((ad) =>
      drawPremiumAdElement(ad)
    );
    adsContainer.append(premiumAdElements);
  }

  adsContainer.append(getRegularAdsElements(adsList));

  adsContainer.append(
    '<div class="adslist-see-more"><a href="//kode24.no/jobb/"><span>Se alle stillinger (' +
      (adsList.length + premiumAdsList.length) +
      ")</span></a></div>"
  );
  return adsContainer;
}

function drawRelatedArticles(articles, tag) {
  /** Draw related-articles-container */
  articles = articles.slice(0, 3);
  var relatedContainer = $(
    '<div class="aside-container related"><h3>Siste fra: ' + tag + "</h3></div>"
  );
  articles.forEach(function (article, index) {
    var articleElement = $(`
        <article class="article top ${index === 0 ? "top" : ""}">
        <a class="article-link" href="//kode24.no${article.published_url}">
         <div class="article-image"><img alt="article image" src="//dbstatic.no/${
           article.image
         }.jpg?width=400"></div>
        <div class="text-content">
            <h4>${article.title}</h4>
        </div>    
         </a></article>`);
    relatedContainer.append(articleElement);
  });

  return relatedContainer;
}

function drawFrontArticles(articles) {
  /** Draw related-articles-container */
  articles = articles.slice(0, 5);
  var relatedContainer = $(
    '<div class="aside-container related front"><h3>Siste nytt</h3></div>'
  );
  articles.forEach(function (article, index) {
    var articleElement = $(`
        <article class="article">
        <a class="article-link" href="${article.url}">
         <div class="article-image"><img alt="article image" src="//dbstatic.no/${
           article.imageUrl
         }"></div>
        <div class="text-content">
            <h4>${$("<div>" + article.title + "</div>").text()}</h4>
            <h5>${$("<div>" + article.description + "</div>").text()}</h5>
        </div>    
         </a></article>`);
    relatedContainer.append(articleElement);
  });

  return relatedContainer;
}

function getRegularAdsElements(adsList) {
  var regularAds = $('<div class="regular-ad"></div>');
  shuffleArray(adsList);
  adsList.forEach(function (ad) {
    if (ad.visibility_status === "P") {
      var cities = getCitysFromTags(ad.tags);
      var adElement = $(`
            <a class="ad" href="//kode24.no${ad.published_url}">
            <div class="ad-company-logo"><img alt="company logo" src="https://dbstatic.no${ad.full_bylines[0].imageUrl}"></div>
            <h4>
                ${ad.full_bylines[0].firstname}&nbsp;
            </h4>
            <h5>${ad.title}</h5>
            </a>`);
      var citiesElement = $('<p class="cities"></p>');
      cities.forEach(function (city) {
        citiesElement.append($("<span>" + city + "</span>"));
      });
      adElement.append(citiesElement);
      regularAds.append(adElement);
    }
  });

  return regularAds;
}

function getRandomItemFromArray(itemsArray) {
  return itemsArray[Math.floor(Math.random() * itemsArray.length)];
}

function drawPremiumAdElement(premiumAd, compact) {
  var cities = getCitysFromTags(premiumAd.tags);
  var premiumAdElement = $(`<a class="premium-ad ad" href="//kode24.no${
    premiumAd.published_url
  }">
    ${
      compact
        ? ""
        : `<div class="ad-image"><img alt="premium ad image" src="//dbstatic.no/${premiumAd.image}.jpg?width=400"></div>`
    }
            <div class="ad-text">
            <div class="ad-company-logo"><img alt="premium ad image" src="https://dbstatic.no${
              premiumAd.full_bylines[0].imageUrl
            }"></div>
                <h4>${premiumAd.full_bylines[0].firstname}</h4>
                <h5>${premiumAd.title}</h5>
                <h6>${premiumAd.subtitle}</h6>
            </div>
            
        </a>`);

  var citiesElement = $('<p class="cities"></p>');
  cities.forEach(function (city) {
    citiesElement.append($("<span>" + city + "</span>"));
  });
  premiumAdElement.append(citiesElement);

  return premiumAdElement;
}

function drawInlineArticleAdElement(ad) {
  var cities = getCitysFromTags(ad.tags);
  var adElement = $(`<a class="premium-ad ad" href="//kode24.no${ad.published_url}"><div class="ad-image"><img alt="premium ad image" src="//dbstatic.no/${ad.image}.jpg?width=400"></div>
            <div class="ad-text">
            <div class="ad-company-logo"><img alt="premium ad image" src="https://dbstatic.no${ad.full_bylines[0].imageUrl}"></div>
                <h4>${ad.full_bylines[0].firstname}</h4>
                <h5>${ad.title}</h5>
                <h6>${ad.subtitle}</h6>
            </div>
            
  </a>`);

  var citiesElement = $('<p class="cities"></p>');
  cities.forEach(function (city) {
    citiesElement.append($("<span>" + city + "</span>"));
  });
  adElement.append(citiesElement);

  return adElement;
}

function drawQuickJobApplicationForm(mailAddressToWorkplace, jobTitle, jobUrl) {
  let wrapper = $(`
    <section class="quick-job-container">
        <div class="quick-job-content">
          <h4>Nysgjerrig på jobben? 💖</h4>
          <p>Bare skriv inn e-postadressen din under, så hører du fra oss. </p>
          <form id="quick-job-form">
            <div class="form-row">
              <label for="email">E-postadresse</label>
              <input id="email" type="text">
            </div>
            <div class="form-row">
              <button type="submit"><span class="description">Send</span> <span class="rocket"><span>🚀</span></span></button>
            </div>
          </form>
        </div>
      
    </section>
  `);
  wrapper.find("#quick-job-form").on("submit", function (event) {
    event.preventDefault();
    let email = wrapper.find("#email").val();
    if (!email.length) {
      alert("Du glemte å fylle ut e-postadresse i søknadsskjemaet. 😉");
    } else {
      wrapper.find(".rocket").addClass("spin");

      $.post(
        "https://functions.kode24.no/api/sendmail",
        {
          from: "jobb@kode24.no",
          to: mailAddressToWorkplace,
          applicant: email,
          jobUrl: "https://www.kode24.no" + jobUrl,
          jobTitle: jobTitle,
        },
        function (data, status) {
          wrapper.find(".rocket").removeClass("spin").addClass("shoot");
          wrapper.find("button").addClass("submitted");
          wrapper.find("button .description").text("Takk!");
        }
      );
    }
  });
  $(".body-copy").append(wrapper);
}

$(function() {
  if (window.location.pathname.indexOf("/jobb/") > -1) {
    const articleArray = /[A-Za-z:]*\/\/[0-9a-z\.:]*\/[a-z]*\/[a-z-]*\/([0-9]*).*/.exec(
      window.location.href
    );
    const articleId = articleArray[1];
    const articleObject = {
      articleId: articleId,
      clicked: new Date(),
      url: window.location.href,
      referrerUrl: document.referrer
    };

    if (articleId.length > 1) {
      $.post(
        "https://kode24-joblisting.herokuapp.com/api/listing/add/click",
        articleObject
      );
    }
    $("a").on("click", event => {
      let target = $(event.target);
      let url = target.prop("href");

      if (url.indexOf("kode24.no") < 0) {
        $.post(
          "https://kode24-joblisting.herokuapp.com/api/listing/add/otherclick",
          {
            articleId: articleId,
            clicked: new Date(),
            url: url
          }
        );
      }
    });
    $(".job-ad-cta").on("click", () => {
      $.post(
        "https://kode24-joblisting.herokuapp.com/api/listing/add/appliedclick",
        articleObject
      );
    });
  }
});

// tracks clicks on outbound links
/**
 * Funksjon som sporer klikk på en utgående link i Analytics.
 * Denne funksjonen tar en gyldig nettadressestreng som argument og bruker denne strengen
 * som aktivitetsetikett. Hvis transportmetoden angis som «beacon», kan treffet sendes
 * med «navigator.sendBeacon» i nettlesere som støtter dette.
 */
var trackOutboundLink = function (url, eventCategory, eventAction) {
  ga("send", "event", {
    eventCategory: eventCategory,
    eventAction: eventAction,
    eventLabel: url,
    transport: "beacon",
  });
};

$(function () {
  $("a").click(function (event) {
    let targetUrl = event.currentTarget.href;
    if (targetUrl.indexOf("https://www.kode24.no/") < 0) {
      trackOutboundLink(targetUrl, "Ekstern_lenke", "klikk");
    }
  });
});

// Sets top navigation and header cloak to sticky when user scrolls
if (window.location.pathname !== "/") {
  var headerNavigation = document.getElementById("top-navigation");
  var headerCloak = document.getElementById("header-cloak");
  var alwaysSticky = false;

  document.addEventListener("DOMContentLoaded", (event) => {
    if (
      !document.querySelector("article header .full-bleed") &&
      headerNavigation &&
      headerCloak
    ) {
      headerNavigation.classList.add("sticky");
      headerCloak.classList.add("sticky", "no-animation");
      alwaysSticky = true;
    } else {
    }
  });

  window.onscroll = function () {
    if (headerNavigation && headerCloak) {
      if (window.pageYOffset > 0) {
        headerNavigation.classList.add("sticky");
        headerCloak.classList.add("sticky");
      } else if (!alwaysSticky) {
        headerNavigation.classList.remove("sticky");
        headerCloak.classList.remove("sticky");
      }
    }
  };
}

function randomNumber(max) {
  return Math.floor(Math.random() * max + 0);
}

function parseForBanners(data) {
  try {
    return JSON.parse(
      data.result[0].content["lab-dz-1"][0].children[0].data.markup
    );
  } catch (error) {
    return false;
  }
}
// true for front, false for article
// defines where banner should be drawn.
// After menu on front, after byline on articles
function initBanner(frontOrArticleToggle) {
  let main = frontOrArticleToggle ? $("main") : $("article header").next(); // the element after the header
  getRandomBanner((banner) => {
    let adElement = createBannerElement(banner);
    if (adElement) {
      if (!document.querySelector("header .full-bleed")) {
        main.before(adElement);
      }

      adElement.find("a").on("click", () => {
        trackOutboundLink(campaignName, eventName, "klikk");
      });
    }
  });
}

/**
 * Fetches api of banners
 */
function createBannerElement(banner) {
  let desktopAd = banner.desktopBannerUrl;
  let mobileAd = banner.mobileBannerUrl;
  let mobileWidth = banner.mobileWidth || "";
  let mobileHeight = banner.mobileHeight || "";
  let desktopWidth = banner.desktopWidth || "";
  let desktopHeight = banner.desktopHeight || "";
  let url = banner.url;
  let type = banner.type || "image";
  let eventName = banner.eventName;

  // Må endres hver gang
  let campaignName = "bannerannonse kode24";
  var AdElement = "";
  if (type === "iframe") {
    adElement = $(`
          <div class="row top-profile" style="margin-top: 20px; max-width: ${desktopWidth};">
            <div class="kicker">ANNONSE</div> 
            <figure class="desktop">
              <iframe src="${desktopAd}" frameborder="0" style="width:${desktopWidth}; height:${desktopHeight};"></iframe>
            </figure>

            <figure class="mobile">
              <iframe src="${mobileAd}" frameborder="0" style="width:${mobileWidth}; height:${mobileHeight}"></iframe>
            </figure>
          </div>    
        `);
  } else {
    adElement = $(`
          <div class="row top-profile" style="margin-top: 20px;">
            <a rel="noopener" itemprop="url" class="top-banner" href="${url}" target="_blank">
              <div class="kicker">ANNONSE</div> 
              <figure class="desktop">
                  <img itemprop="image" alt="annonse" src="${desktopAd}">
              </figure>

              <figure class="mobile">
                  <img itemprop="image" alt="annonse" src="${mobileAd}">
              </figure>
            </a>
          </div>    
        `);
  }
  return adElement;
}

// fetch bannerconfig from labrador, and pick out random banner
// of it fails, callback false
function getRandomBanner(callback) {
  getUrl("//api.kode24.no/front/?query=id:70559216", function (data) {
    let config = parseForBanners(data);
    if (config) {
      let ads = config;
      let adNumber = randomNumber(ads.length);

      let ad = ads[adNumber];
      callback(ad);
    } else {
      callback(false);
    }
  });
}

/*! highlight.js v9.12.0 | BSD3 License | git.io/hljslicense */
!function(e){var t="object"==typeof window&&window||"object"==typeof self&&self;"undefined"!=typeof exports?e(exports):t&&(t.hljs=e({}),"function"==typeof define&&define.amd&&define([],function(){return t.hljs}))}(function(e){function t(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r(e){return e.nodeName.toLowerCase()}function a(e,t){var r=e&&e.exec(t);return r&&0===r.index}function n(e){return E.test(e)}function i(e){var t,r,a,i,s=e.className+" ";if(s+=e.parentNode?e.parentNode.className:"",r=M.exec(s))return w(r[1])?r[1]:"no-highlight";for(s=s.split(/\s+/),t=0,a=s.length;a>t;t++)if(i=s[t],n(i)||w(i))return i}function s(e){var t,r={},a=Array.prototype.slice.call(arguments,1);for(t in e)r[t]=e[t];return a.forEach(function(e){for(t in e)r[t]=e[t]}),r}function c(e){var t=[];return function a(e,n){for(var i=e.firstChild;i;i=i.nextSibling)3===i.nodeType?n+=i.nodeValue.length:1===i.nodeType&&(t.push({event:"start",offset:n,node:i}),n=a(i,n),r(i).match(/br|hr|img|input/)||t.push({event:"stop",offset:n,node:i}));return n}(e,0),t}function o(e,a,n){function i(){return e.length&&a.length?e[0].offset!==a[0].offset?e[0].offset<a[0].offset?e:a:"start"===a[0].event?e:a:e.length?e:a}function s(e){function a(e){return" "+e.nodeName+'="'+t(e.value).replace('"',"&quot;")+'"'}u+="<"+r(e)+N.map.call(e.attributes,a).join("")+">"}function c(e){u+="</"+r(e)+">"}function o(e){("start"===e.event?s:c)(e.node)}for(var l=0,u="",d=[];e.length||a.length;){var b=i();if(u+=t(n.substring(l,b[0].offset)),l=b[0].offset,b===e){d.reverse().forEach(c);do o(b.splice(0,1)[0]),b=i();while(b===e&&b.length&&b[0].offset===l);d.reverse().forEach(s)}else"start"===b[0].event?d.push(b[0].node):d.pop(),o(b.splice(0,1)[0])}return u+t(n.substr(l))}function l(e){return e.v&&!e.cached_variants&&(e.cached_variants=e.v.map(function(t){return s(e,{v:null},t)})),e.cached_variants||e.eW&&[s(e)]||[e]}function u(e){function t(e){return e&&e.source||e}function r(r,a){return new RegExp(t(r),"m"+(e.cI?"i":"")+(a?"g":""))}function a(n,i){if(!n.compiled){if(n.compiled=!0,n.k=n.k||n.bK,n.k){var s={},c=function(t,r){e.cI&&(r=r.toLowerCase()),r.split(" ").forEach(function(e){var r=e.split("|");s[r[0]]=[t,r[1]?Number(r[1]):1]})};"string"==typeof n.k?c("keyword",n.k):k(n.k).forEach(function(e){c(e,n.k[e])}),n.k=s}n.lR=r(n.l||/\w+/,!0),i&&(n.bK&&(n.b="\\b("+n.bK.split(" ").join("|")+")\\b"),n.b||(n.b=/\B|\b/),n.bR=r(n.b),n.e||n.eW||(n.e=/\B|\b/),n.e&&(n.eR=r(n.e)),n.tE=t(n.e)||"",n.eW&&i.tE&&(n.tE+=(n.e?"|":"")+i.tE)),n.i&&(n.iR=r(n.i)),null==n.r&&(n.r=1),n.c||(n.c=[]),n.c=Array.prototype.concat.apply([],n.c.map(function(e){return l("self"===e?n:e)})),n.c.forEach(function(e){a(e,n)}),n.starts&&a(n.starts,i);var o=n.c.map(function(e){return e.bK?"\\.?("+e.b+")\\.?":e.b}).concat([n.tE,n.i]).map(t).filter(Boolean);n.t=o.length?r(o.join("|"),!0):{exec:function(){return null}}}}a(e)}function d(e,r,n,i){function s(e,t){var r,n;for(r=0,n=t.c.length;n>r;r++)if(a(t.c[r].bR,e))return t.c[r]}function c(e,t){if(a(e.eR,t)){for(;e.endsParent&&e.parent;)e=e.parent;return e}return e.eW?c(e.parent,t):void 0}function o(e,t){return!n&&a(t.iR,e)}function l(e,t){var r=v.cI?t[0].toLowerCase():t[0];return e.k.hasOwnProperty(r)&&e.k[r]}function p(e,t,r,a){var n=a?"":L.classPrefix,i='<span class="'+n,s=r?"":R;return i+=e+'">',i+t+s}function m(){var e,r,a,n;if(!N.k)return t(E);for(n="",r=0,N.lR.lastIndex=0,a=N.lR.exec(E);a;)n+=t(E.substring(r,a.index)),e=l(N,a),e?(M+=e[1],n+=p(e[0],t(a[0]))):n+=t(a[0]),r=N.lR.lastIndex,a=N.lR.exec(E);return n+t(E.substr(r))}function f(){var e="string"==typeof N.sL;if(e&&!x[N.sL])return t(E);var r=e?d(N.sL,E,!0,k[N.sL]):b(E,N.sL.length?N.sL:void 0);return N.r>0&&(M+=r.r),e&&(k[N.sL]=r.top),p(r.language,r.value,!1,!0)}function g(){C+=null!=N.sL?f():m(),E=""}function _(e){C+=e.cN?p(e.cN,"",!0):"",N=Object.create(e,{parent:{value:N}})}function h(e,t){if(E+=e,null==t)return g(),0;var r=s(t,N);if(r)return r.skip?E+=t:(r.eB&&(E+=t),g(),r.rB||r.eB||(E=t)),_(r,t),r.rB?0:t.length;var a=c(N,t);if(a){var n=N;n.skip?E+=t:(n.rE||n.eE||(E+=t),g(),n.eE&&(E=t));do N.cN&&(C+=R),N.skip||(M+=N.r),N=N.parent;while(N!==a.parent);return a.starts&&_(a.starts,""),n.rE?0:t.length}if(o(t,N))throw new Error('Illegal lexeme "'+t+'" for mode "'+(N.cN||"<unnamed>")+'"');return E+=t,t.length||1}var v=w(e);if(!v)throw new Error('Unknown language: "'+e+'"');u(v);var y,N=i||v,k={},C="";for(y=N;y!==v;y=y.parent)y.cN&&(C=p(y.cN,"",!0)+C);var E="",M=0;try{for(var B,S,$=0;;){if(N.t.lastIndex=$,B=N.t.exec(r),!B)break;S=h(r.substring($,B.index),B[0]),$=B.index+S}for(h(r.substr($)),y=N;y.parent;y=y.parent)y.cN&&(C+=R);return{r:M,value:C,language:e,top:N}}catch(A){if(A.message&&-1!==A.message.indexOf("Illegal"))return{r:0,value:t(r)};throw A}}function b(e,r){r=r||L.languages||k(x);var a={r:0,value:t(e)},n=a;return r.filter(w).forEach(function(t){var r=d(t,e,!1);r.language=t,r.r>n.r&&(n=r),r.r>a.r&&(n=a,a=r)}),n.language&&(a.second_best=n),a}function p(e){return L.tabReplace||L.useBR?e.replace(B,function(e,t){return L.useBR&&"\n"===e?"<br>":L.tabReplace?t.replace(/\t/g,L.tabReplace):""}):e}function m(e,t,r){var a=t?C[t]:r,n=[e.trim()];return e.match(/\bhljs\b/)||n.push("hljs"),-1===e.indexOf(a)&&n.push(a),n.join(" ").trim()}function f(e){var t,r,a,s,l,u=i(e);n(u)||(L.useBR?(t=document.createElementNS("http://www.w3.org/1999/xhtml","div"),t.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ \/]*>/g,"\n")):t=e,l=t.textContent,a=u?d(u,l,!0):b(l),r=c(t),r.length&&(s=document.createElementNS("http://www.w3.org/1999/xhtml","div"),s.innerHTML=a.value,a.value=o(r,c(s),l)),a.value=p(a.value),e.innerHTML=a.value,e.className=m(e.className,u,a.language),e.result={language:a.language,re:a.r},a.second_best&&(e.second_best={language:a.second_best.language,re:a.second_best.r}))}function g(e){L=s(L,e)}function _(){if(!_.called){_.called=!0;var e=document.querySelectorAll("pre code");N.forEach.call(e,f)}}function h(){addEventListener("DOMContentLoaded",_,!1),addEventListener("load",_,!1)}function v(t,r){var a=x[t]=r(e);a.aliases&&a.aliases.forEach(function(e){C[e]=t})}function y(){return k(x)}function w(e){return e=(e||"").toLowerCase(),x[e]||x[C[e]]}var N=[],k=Object.keys,x={},C={},E=/^(no-?highlight|plain|text)$/i,M=/\blang(?:uage)?-([\w-]+)\b/i,B=/((^(<[^>]+>|\t|)+|(?:\n)))/gm,R="</span>",L={classPrefix:"hljs-",tabReplace:null,useBR:!1,languages:void 0};return e.highlight=d,e.highlightAuto=b,e.fixMarkup=p,e.highlightBlock=f,e.configure=g,e.initHighlighting=_,e.initHighlightingOnLoad=h,e.registerLanguage=v,e.listLanguages=y,e.getLanguage=w,e.inherit=s,e.IR="[a-zA-Z]\\w*",e.UIR="[a-zA-Z_]\\w*",e.NR="\\b\\d+(\\.\\d+)?",e.CNR="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",e.BNR="\\b(0b[01]+)",e.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",e.BE={b:"\\\\[\\s\\S]",r:0},e.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:[e.BE]},e.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:[e.BE]},e.PWM={b:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},e.C=function(t,r,a){var n=e.inherit({cN:"comment",b:t,e:r,c:[]},a||{});return n.c.push(e.PWM),n.c.push({cN:"doctag",b:"(?:TODO|FIXME|NOTE|BUG|XXX):",r:0}),n},e.CLCM=e.C("//","$"),e.CBCM=e.C("/\\*","\\*/"),e.HCM=e.C("#","$"),e.NM={cN:"number",b:e.NR,r:0},e.CNM={cN:"number",b:e.CNR,r:0},e.BNM={cN:"number",b:e.BNR,r:0},e.CSSNM={cN:"number",b:e.NR+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",r:0},e.RM={cN:"regexp",b:/\//,e:/\/[gimuy]*/,i:/\n/,c:[e.BE,{b:/\[/,e:/\]/,r:0,c:[e.BE]}]},e.TM={cN:"title",b:e.IR,r:0},e.UTM={cN:"title",b:e.UIR,r:0},e.METHOD_GUARD={b:"\\.\\s*"+e.UIR,r:0},e.registerLanguage("apache",function(e){var t={cN:"number",b:"[\\$%]\\d+"};return{aliases:["apacheconf"],cI:!0,c:[e.HCM,{cN:"section",b:"</?",e:">"},{cN:"attribute",b:/\w+/,r:0,k:{nomarkup:"order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"},starts:{e:/$/,r:0,k:{literal:"on off all"},c:[{cN:"meta",b:"\\s\\[",e:"\\]$"},{cN:"variable",b:"[\\$%]\\{",e:"\\}",c:["self",t]},t,e.QSM]}}],i:/\S/}}),e.registerLanguage("bash",function(e){var t={cN:"variable",v:[{b:/\$[\w\d#@][\w\d_]*/},{b:/\$\{(.*?)}/}]},r={cN:"string",b:/"/,e:/"/,c:[e.BE,t,{cN:"variable",b:/\$\(/,e:/\)/,c:[e.BE]}]},a={cN:"string",b:/'/,e:/'/};return{aliases:["sh","zsh"],l:/\b-?[a-z\._]+\b/,k:{keyword:"if then else elif fi for while in do done case esac function",literal:"true false",built_in:"break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp",_:"-ne -eq -lt -gt -f -d -e -s -l -a"},c:[{cN:"meta",b:/^#![^\n]+sh\s*$/,r:10},{cN:"function",b:/\w[\w\d_]*\s*\(\s*\)\s*\{/,rB:!0,c:[e.inherit(e.TM,{b:/\w[\w\d_]*/})],r:0},e.HCM,r,a,t]}}),e.registerLanguage("coffeescript",function(e){var t={keyword:"in if for while finally new do return else break catch instanceof throw try this switch continue typeof delete debugger super yield import export from as default await then unless until loop of by when and or is isnt not",literal:"true false null undefined yes no on off",built_in:"npm require console print module global window document"},r="[A-Za-z$_][0-9A-Za-z$_]*",a={cN:"subst",b:/#\{/,e:/}/,k:t},n=[e.BNM,e.inherit(e.CNM,{starts:{e:"(\\s*/)?",r:0}}),{cN:"string",v:[{b:/'''/,e:/'''/,c:[e.BE]},{b:/'/,e:/'/,c:[e.BE]},{b:/"""/,e:/"""/,c:[e.BE,a]},{b:/"/,e:/"/,c:[e.BE,a]}]},{cN:"regexp",v:[{b:"///",e:"///",c:[a,e.HCM]},{b:"//[gim]*",r:0},{b:/\/(?![ *])(\\\/|.)*?\/[gim]*(?=\W|$)/}]},{b:"@"+r},{sL:"javascript",eB:!0,eE:!0,v:[{b:"```",e:"```"},{b:"`",e:"`"}]}];a.c=n;var i=e.inherit(e.TM,{b:r}),s="(\\(.*\\))?\\s*\\B[-=]>",c={cN:"params",b:"\\([^\\(]",rB:!0,c:[{b:/\(/,e:/\)/,k:t,c:["self"].concat(n)}]};return{aliases:["coffee","cson","iced"],k:t,i:/\/\*/,c:n.concat([e.C("###","###"),e.HCM,{cN:"function",b:"^\\s*"+r+"\\s*=\\s*"+s,e:"[-=]>",rB:!0,c:[i,c]},{b:/[:\(,=]\s*/,r:0,c:[{cN:"function",b:s,e:"[-=]>",rB:!0,c:[c]}]},{cN:"class",bK:"class",e:"$",i:/[:="\[\]]/,c:[{bK:"extends",eW:!0,i:/[:="\[\]]/,c:[i]},i]},{b:r+":",e:":",rB:!0,rE:!0,r:0}])}}),e.registerLanguage("cpp",function(e){var t={cN:"keyword",b:"\\b[a-z\\d_]*_t\\b"},r={cN:"string",v:[{b:'(u8?|U)?L?"',e:'"',i:"\\n",c:[e.BE]},{b:'(u8?|U)?R"',e:'"',c:[e.BE]},{b:"'\\\\?.",e:"'",i:"."}]},a={cN:"number",v:[{b:"\\b(0b[01']+)"},{b:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{b:"(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"}],r:0},n={cN:"meta",b:/#\s*[a-z]+\b/,e:/$/,k:{"meta-keyword":"if else elif endif define undef warning error line pragma ifdef ifndef include"},c:[{b:/\\\n/,r:0},e.inherit(r,{cN:"meta-string"}),{cN:"meta-string",b:/<[^\n>]*>/,e:/$/,i:"\\n"},e.CLCM,e.CBCM]},i=e.IR+"\\s*\\(",s={keyword:"int float while private char catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignof constexpr decltype noexcept static_assert thread_local restrict _Bool complex _Complex _Imaginary atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and or not",built_in:"std string cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap array shared_ptr abort abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr",literal:"true false nullptr NULL"},c=[t,e.CLCM,e.CBCM,a,r];return{aliases:["c","cc","h","c++","h++","hpp"],k:s,i:"</",c:c.concat([n,{b:"\\b(deque|list|queue|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",e:">",k:s,c:["self",t]},{b:e.IR+"::",k:s},{v:[{b:/=/,e:/;/},{b:/\(/,e:/\)/},{bK:"new throw return else",e:/;/}],k:s,c:c.concat([{b:/\(/,e:/\)/,k:s,c:c.concat(["self"]),r:0}]),r:0},{cN:"function",b:"("+e.IR+"[\\*&\\s]+)+"+i,rB:!0,e:/[{;=]/,eE:!0,k:s,i:/[^\w\s\*&]/,c:[{b:i,rB:!0,c:[e.TM],r:0},{cN:"params",b:/\(/,e:/\)/,k:s,r:0,c:[e.CLCM,e.CBCM,r,a,t]},e.CLCM,e.CBCM,n]},{cN:"class",bK:"class struct",e:/[{;:]/,c:[{b:/</,e:/>/,c:["self"]},e.TM]}]),exports:{preprocessor:n,strings:r,k:s}}}),e.registerLanguage("cs",function(e){var t={keyword:"abstract as base bool break byte case catch char checked const continue decimal default delegate do double enum event explicit extern finally fixed float for foreach goto if implicit in int interface internal is lock long nameof object operator out override params private protected public readonly ref sbyte sealed short sizeof stackalloc static string struct switch this try typeof uint ulong unchecked unsafe ushort using virtual void volatile while add alias ascending async await by descending dynamic equals from get global group into join let on orderby partial remove select set value var where yield",literal:"null false true"},r={cN:"string",b:'@"',e:'"',c:[{b:'""'}]},a=e.inherit(r,{i:/\n/}),n={cN:"subst",b:"{",e:"}",k:t},i=e.inherit(n,{i:/\n/}),s={cN:"string",b:/\$"/,e:'"',i:/\n/,c:[{b:"{{"},{b:"}}"},e.BE,i]},c={cN:"string",b:/\$@"/,e:'"',c:[{b:"{{"},{b:"}}"},{b:'""'},n]},o=e.inherit(c,{i:/\n/,c:[{b:"{{"},{b:"}}"},{b:'""'},i]});n.c=[c,s,r,e.ASM,e.QSM,e.CNM,e.CBCM],i.c=[o,s,a,e.ASM,e.QSM,e.CNM,e.inherit(e.CBCM,{i:/\n/})];var l={v:[c,s,r,e.ASM,e.QSM]},u=e.IR+"(<"+e.IR+"(\\s*,\\s*"+e.IR+")*>)?(\\[\\])?";return{aliases:["csharp"],k:t,i:/::/,c:[e.C("///","$",{rB:!0,c:[{cN:"doctag",v:[{b:"///",r:0},{b:"<!--|-->"},{b:"</?",e:">"}]}]}),e.CLCM,e.CBCM,{cN:"meta",b:"#",e:"$",k:{"meta-keyword":"if else elif endif define undef warning error line region endregion pragma checksum"}},l,e.CNM,{bK:"class interface",e:/[{;=]/,i:/[^\s:]/,c:[e.TM,e.CLCM,e.CBCM]},{bK:"namespace",e:/[{;=]/,i:/[^\s:]/,c:[e.inherit(e.TM,{b:"[a-zA-Z](\\.?\\w)*"}),e.CLCM,e.CBCM]},{cN:"meta",b:"^\\s*\\[",eB:!0,e:"\\]",eE:!0,c:[{cN:"meta-string",b:/"/,e:/"/}]},{bK:"new return throw await else",r:0},{cN:"function",b:"("+u+"\\s+)+"+e.IR+"\\s*\\(",rB:!0,e:/[{;=]/,eE:!0,k:t,c:[{b:e.IR+"\\s*\\(",rB:!0,c:[e.TM],r:0},{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,k:t,r:0,c:[l,e.CNM,e.CBCM]},e.CLCM,e.CBCM]}]}}),e.registerLanguage("css",function(e){var t="[a-zA-Z-][a-zA-Z0-9_-]*",r={b:/[A-Z\_\.\-]+\s*:/,rB:!0,e:";",eW:!0,c:[{cN:"attribute",b:/\S/,e:":",eE:!0,starts:{eW:!0,eE:!0,c:[{b:/[\w-]+\(/,rB:!0,c:[{cN:"built_in",b:/[\w-]+/},{b:/\(/,e:/\)/,c:[e.ASM,e.QSM]}]},e.CSSNM,e.QSM,e.ASM,e.CBCM,{cN:"number",b:"#[0-9A-Fa-f]+"},{cN:"meta",b:"!important"}]}}]};return{cI:!0,i:/[=\/|'\$]/,c:[e.CBCM,{cN:"selector-id",b:/#[A-Za-z0-9_-]+/},{cN:"selector-class",b:/\.[A-Za-z0-9_-]+/},{cN:"selector-attr",b:/\[/,e:/\]/,i:"$"},{cN:"selector-pseudo",b:/:(:)?[a-zA-Z0-9\_\-\+\(\)"'.]+/},{b:"@(font-face|page)",l:"[a-z-]+",k:"font-face page"},{b:"@",e:"[{;]",i:/:/,c:[{cN:"keyword",b:/\w+/},{b:/\s/,eW:!0,eE:!0,r:0,c:[e.ASM,e.QSM,e.CSSNM]}]},{cN:"selector-tag",b:t,r:0},{b:"{",e:"}",i:/\S/,c:[e.CBCM,r]}]}}),e.registerLanguage("diff",function(e){return{aliases:["patch"],c:[{cN:"meta",r:10,v:[{b:/^@@ +\-\d+,\d+ +\+\d+,\d+ +@@$/},{b:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{b:/^\-\-\- +\d+,\d+ +\-\-\-\-$/}]},{cN:"comment",v:[{b:/Index: /,e:/$/},{b:/={3,}/,e:/$/},{b:/^\-{3}/,e:/$/},{b:/^\*{3} /,e:/$/},{b:/^\+{3}/,e:/$/},{b:/\*{5}/,e:/\*{5}$/}]},{cN:"addition",b:"^\\+",e:"$"},{cN:"deletion",b:"^\\-",e:"$"},{cN:"addition",b:"^\\!",e:"$"}]}}),e.registerLanguage("http",function(e){var t="HTTP/[0-9\\.]+";return{aliases:["https"],i:"\\S",c:[{b:"^"+t,e:"$",c:[{cN:"number",b:"\\b\\d{3}\\b"}]},{b:"^[A-Z]+ (.*?) "+t+"$",rB:!0,e:"$",c:[{cN:"string",b:" ",e:" ",eB:!0,eE:!0},{b:t},{cN:"keyword",b:"[A-Z]+"}]},{cN:"attribute",b:"^\\w",e:": ",eE:!0,i:"\\n|\\s|=",starts:{e:"$",r:0}},{b:"\\n\\n",starts:{sL:[],eW:!0}}]}}),e.registerLanguage("ini",function(e){var t={cN:"string",c:[e.BE],v:[{b:"'''",e:"'''",r:10},{b:'"""',e:'"""',r:10},{b:'"',e:'"'},{b:"'",e:"'"}]};return{aliases:["toml"],cI:!0,i:/\S/,c:[e.C(";","$"),e.HCM,{cN:"section",b:/^\s*\[+/,e:/\]+/},{b:/^[a-z0-9\[\]_-]+\s*=\s*/,e:"$",rB:!0,c:[{cN:"attr",b:/[a-z0-9\[\]_-]+/},{b:/=/,eW:!0,r:0,c:[{cN:"literal",b:/\bon|off|true|false|yes|no\b/},{cN:"variable",v:[{b:/\$[\w\d"][\w\d_]*/},{b:/\$\{(.*?)}/}]},t,{cN:"number",b:/([\+\-]+)?[\d]+_[\d_]+/},e.NM]}]}]}}),e.registerLanguage("java",function(e){var t="[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*",r=t+"(<"+t+"(\\s*,\\s*"+t+")*>)?",a="false synchronized int abstract float private char boolean static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private module requires exports do",n="\\b(0[bB]([01]+[01_]+[01]+|[01]+)|0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)|(([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?|\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))([eE][-+]?\\d+)?)[lLfF]?",i={cN:"number",b:n,r:0};return{aliases:["jsp"],k:a,i:/<\/|#/,c:[e.C("/\\*\\*","\\*/",{r:0,c:[{b:/\w+@/,r:0},{cN:"doctag",b:"@[A-Za-z]+"}]}),e.CLCM,e.CBCM,e.ASM,e.QSM,{cN:"class",bK:"class interface",e:/[{;=]/,eE:!0,k:"class interface",i:/[:"\[\]]/,c:[{bK:"extends implements"},e.UTM]},{bK:"new throw return else",r:0},{cN:"function",b:"("+r+"\\s+)+"+e.UIR+"\\s*\\(",rB:!0,e:/[{;=]/,eE:!0,k:a,c:[{b:e.UIR+"\\s*\\(",rB:!0,r:0,c:[e.UTM]},{cN:"params",b:/\(/,e:/\)/,k:a,r:0,c:[e.ASM,e.QSM,e.CNM,e.CBCM]},e.CLCM,e.CBCM]},i,{cN:"meta",b:"@[A-Za-z]+"}]}}),e.registerLanguage("javascript",function(e){var t="[A-Za-z$_][0-9A-Za-z$_]*",r={keyword:"in of if for while finally var new function do return void else break catch instanceof with throw case default try this switch continue typeof delete let yield const export super debugger as async await static import from as",literal:"true false null undefined NaN Infinity",built_in:"eval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Error EvalError InternalError RangeError ReferenceError StopIteration SyntaxError TypeError URIError Number Math Date String RegExp Array Float32Array Float64Array Int16Array Int32Array Int8Array Uint16Array Uint32Array Uint8Array Uint8ClampedArray ArrayBuffer DataView JSON Intl arguments require module console window document Symbol Set Map WeakSet WeakMap Proxy Reflect Promise"},a={cN:"number",v:[{b:"\\b(0[bB][01]+)"},{b:"\\b(0[oO][0-7]+)"},{b:e.CNR}],r:0},n={cN:"subst",b:"\\$\\{",e:"\\}",k:r,c:[]},i={cN:"string",b:"`",e:"`",c:[e.BE,n]};n.c=[e.ASM,e.QSM,i,a,e.RM];var s=n.c.concat([e.CBCM,e.CLCM]);return{aliases:["js","jsx"],k:r,c:[{cN:"meta",r:10,b:/^\s*['"]use (strict|asm)['"]/},{cN:"meta",b:/^#!/,e:/$/},e.ASM,e.QSM,i,e.CLCM,e.CBCM,a,{b:/[{,]\s*/,r:0,c:[{b:t+"\\s*:",rB:!0,r:0,c:[{cN:"attr",b:t,r:0}]}]},{b:"("+e.RSR+"|\\b(case|return|throw)\\b)\\s*",k:"return throw case",c:[e.CLCM,e.CBCM,e.RM,{cN:"function",b:"(\\(.*?\\)|"+t+")\\s*=>",rB:!0,e:"\\s*=>",c:[{cN:"params",v:[{b:t},{b:/\(\s*\)/},{b:/\(/,e:/\)/,eB:!0,eE:!0,k:r,c:s}]}]},{b:/</,e:/(\/\w+|\w+\/)>/,sL:"xml",c:[{b:/<\w+\s*\/>/,skip:!0},{b:/<\w+/,e:/(\/\w+|\w+\/)>/,skip:!0,c:[{b:/<\w+\s*\/>/,skip:!0},"self"]}]}],r:0},{cN:"function",bK:"function",e:/\{/,eE:!0,c:[e.inherit(e.TM,{b:t}),{cN:"params",b:/\(/,e:/\)/,eB:!0,eE:!0,c:s}],i:/\[|%/},{b:/\$[(.]/},e.METHOD_GUARD,{cN:"class",bK:"class",e:/[{;=]/,eE:!0,i:/[:"\[\]]/,c:[{bK:"extends"},e.UTM]},{bK:"constructor",e:/\{/,eE:!0}],i:/#(?!!)/}}),e.registerLanguage("json",function(e){var t={literal:"true false null"},r=[e.QSM,e.CNM],a={e:",",eW:!0,eE:!0,c:r,k:t},n={b:"{",e:"}",c:[{cN:"attr",b:/"/,e:/"/,c:[e.BE],i:"\\n"},e.inherit(a,{b:/:/})],i:"\\S"},i={b:"\\[",e:"\\]",c:[e.inherit(a)],i:"\\S"};return r.splice(r.length,0,n,i),{c:r,k:t,i:"\\S"}}),e.registerLanguage("makefile",function(e){var t={cN:"variable",v:[{b:"\\$\\("+e.UIR+"\\)",c:[e.BE]},{b:/\$[@%<?\^\+\*]/}]},r={cN:"string",b:/"/,e:/"/,c:[e.BE,t]},a={cN:"variable",b:/\$\([\w-]+\s/,e:/\)/,k:{built_in:"subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"},c:[t]},n={b:"^"+e.UIR+"\\s*[:+?]?=",i:"\\n",rB:!0,c:[{b:"^"+e.UIR,e:"[:+?]?=",eE:!0}]},i={cN:"meta",b:/^\.PHONY:/,e:/$/,k:{"meta-keyword":".PHONY"},l:/[\.\w]+/},s={cN:"section",b:/^[^\s]+:/,e:/$/,c:[t]};return{aliases:["mk","mak"],k:"define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath",l:/[\w-]+/,c:[e.HCM,t,r,a,n,i,s]}}),e.registerLanguage("xml",function(e){var t="[A-Za-z0-9\\._:-]+",r={eW:!0,i:/</,r:0,c:[{cN:"attr",b:t,r:0},{b:/=\s*/,r:0,c:[{cN:"string",endsParent:!0,v:[{b:/"/,e:/"/},{b:/'/,e:/'/},{b:/[^\s"'=<>`]+/}]}]}]};return{aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist"],cI:!0,c:[{cN:"meta",b:"<!DOCTYPE",e:">",r:10,c:[{b:"\\[",e:"\\]"}]},e.C("<!--","-->",{r:10}),{b:"<\\!\\[CDATA\\[",e:"\\]\\]>",r:10},{b:/<\?(php)?/,e:/\?>/,sL:"php",c:[{b:"/\\*",e:"\\*/",skip:!0}]},{cN:"tag",b:"<style(?=\\s|>|$)",e:">",k:{name:"style"},c:[r],starts:{e:"</style>",rE:!0,sL:["css","xml"]}},{cN:"tag",b:"<script(?=\\s|>|$)",e:">",k:{name:"script"},c:[r],starts:{e:"</script>",rE:!0,sL:["actionscript","javascript","handlebars","xml"]}},{cN:"meta",v:[{b:/<\?xml/,e:/\?>/,r:10},{b:/<\?\w+/,e:/\?>/}]},{cN:"tag",b:"</?",e:"/?>",c:[{cN:"name",b:/[^\/><\s]+/,r:0},r]}]}}),e.registerLanguage("markdown",function(e){return{aliases:["md","mkdown","mkd"],c:[{cN:"section",v:[{b:"^#{1,6}",e:"$"},{b:"^.+?\\n[=-]{2,}$"}]},{b:"<",e:">",sL:"xml",r:0},{cN:"bullet",b:"^([*+-]|(\\d+\\.))\\s+"},{cN:"strong",b:"[*_]{2}.+?[*_]{2}"},{cN:"emphasis",v:[{b:"\\*.+?\\*"},{b:"_.+?_",r:0}]},{cN:"quote",b:"^>\\s+",e:"$"},{cN:"code",v:[{b:"^```w*s*$",e:"^```s*$"},{b:"`.+?`"},{b:"^( {4}|	)",e:"$",r:0}]},{b:"^[-\\*]{3,}",e:"$"},{b:"\\[.+?\\][\\(\\[].*?[\\)\\]]",rB:!0,c:[{cN:"string",b:"\\[",e:"\\]",eB:!0,rE:!0,r:0},{cN:"link",b:"\\]\\(",e:"\\)",eB:!0,eE:!0},{cN:"symbol",b:"\\]\\[",e:"\\]",eB:!0,eE:!0}],r:10},{b:/^\[[^\n]+\]:/,rB:!0,c:[{cN:"symbol",b:/\[/,e:/\]/,eB:!0,eE:!0},{cN:"link",b:/:\s*/,e:/$/,eB:!0}]}]}}),e.registerLanguage("nginx",function(e){var t={cN:"variable",v:[{b:/\$\d+/},{b:/\$\{/,e:/}/},{b:"[\\$\\@]"+e.UIR}]},r={eW:!0,l:"[a-z/_]+",k:{literal:"on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"},r:0,i:"=>",c:[e.HCM,{cN:"string",c:[e.BE,t],v:[{b:/"/,e:/"/},{b:/'/,e:/'/}]},{b:"([a-z]+):/",e:"\\s",eW:!0,eE:!0,c:[t]},{cN:"regexp",c:[e.BE,t],v:[{b:"\\s\\^",e:"\\s|{|;",rE:!0},{b:"~\\*?\\s+",e:"\\s|{|;",rE:!0},{b:"\\*(\\.[a-z\\-]+)+"},{b:"([a-z\\-]+\\.)+\\*"}]},{cN:"number",b:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"},{cN:"number",b:"\\b\\d+[kKmMgGdshdwy]*\\b",r:0},t]};return{aliases:["nginxconf"],c:[e.HCM,{b:e.UIR+"\\s+{",rB:!0,e:"{",c:[{cN:"section",b:e.UIR}],r:0},{b:e.UIR+"\\s",e:";|{",rB:!0,c:[{cN:"attribute",b:e.UIR,starts:r}],r:0}],i:"[^\\s\\}]"}}),e.registerLanguage("objectivec",function(e){var t={cN:"built_in",b:"\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"},r={keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign readwrite self @synchronized id typeof nonatomic super unichar IBOutlet IBAction strong weak copy in out inout bycopy byref oneway __strong __weak __block __autoreleasing @private @protected @public @try @property @end @throw @catch @finally @autoreleasepool @synthesize @dynamic @selector @optional @required @encode @package @import @defs @compatibility_alias __bridge __bridge_transfer __bridge_retained __bridge_retain __covariant __contravariant __kindof _Nonnull _Nullable _Null_unspecified __FUNCTION__ __PRETTY_FUNCTION__ __attribute__ getter setter retain unsafe_unretained nonnull nullable null_unspecified null_resettable class instancetype NS_DESIGNATED_INITIALIZER NS_UNAVAILABLE NS_REQUIRES_SUPER NS_RETURNS_INNER_POINTER NS_INLINE NS_AVAILABLE NS_DEPRECATED NS_ENUM NS_OPTIONS NS_SWIFT_UNAVAILABLE NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_REFINED_FOR_SWIFT NS_SWIFT_NAME NS_SWIFT_NOTHROW NS_DURING NS_HANDLER NS_ENDHANDLER NS_VALUERETURN NS_VOIDRETURN",literal:"false true FALSE TRUE nil YES NO NULL",built_in:"BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"},a=/[a-zA-Z@][a-zA-Z0-9_]*/,n="@interface @class @protocol @implementation";return{aliases:["mm","objc","obj-c"],k:r,l:a,i:"</",c:[t,e.CLCM,e.CBCM,e.CNM,e.QSM,{cN:"string",v:[{b:'@"',e:'"',i:"\\n",c:[e.BE]},{b:"'",e:"[^\\\\]'",i:"[^\\\\][^']"}]},{cN:"meta",b:"#",e:"$",c:[{cN:"meta-string",v:[{b:'"',e:'"'},{b:"<",e:">"}]}]},{cN:"class",b:"("+n.split(" ").join("|")+")\\b",e:"({|$)",eE:!0,k:n,l:a,c:[e.UTM]},{b:"\\."+e.UIR,r:0}]}}),e.registerLanguage("perl",function(e){var t="getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qqfileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmgetsub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedirioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when",r={cN:"subst",b:"[$@]\\{",e:"\\}",k:t},a={b:"->{",e:"}"},n={v:[{b:/\$\d/},{b:/[\$%@](\^\w\b|#\w+(::\w+)*|{\w+}|\w+(::\w*)*)/},{b:/[\$%@][^\s\w{]/,r:0}]},i=[e.BE,r,n],s=[n,e.HCM,e.C("^\\=\\w","\\=cut",{eW:!0}),a,{cN:"string",c:i,v:[{b:"q[qwxr]?\\s*\\(",e:"\\)",r:5},{b:"q[qwxr]?\\s*\\[",e:"\\]",r:5},{b:"q[qwxr]?\\s*\\{",e:"\\}",r:5},{b:"q[qwxr]?\\s*\\|",e:"\\|",r:5},{b:"q[qwxr]?\\s*\\<",e:"\\>",r:5},{b:"qw\\s+q",e:"q",r:5},{b:"'",e:"'",c:[e.BE]},{b:'"',e:'"'},{b:"`",e:"`",c:[e.BE]},{b:"{\\w+}",c:[],r:0},{b:"-?\\w+\\s*\\=\\>",c:[],r:0}]},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\/\\/|"+e.RSR+"|\\b(split|return|print|reverse|grep)\\b)\\s*",k:"split return print reverse grep",r:0,c:[e.HCM,{cN:"regexp",b:"(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",r:10},{cN:"regexp",b:"(m|qr)?/",e:"/[a-z]*",c:[e.BE],r:0}]},{cN:"function",bK:"sub",e:"(\\s*\\(.*?\\))?[;{]",eE:!0,r:5,c:[e.TM]},{b:"-\\w\\b",r:0},{b:"^__DATA__$",e:"^__END__$",sL:"mojolicious",c:[{b:"^@@.*",e:"$",cN:"comment"}]}];return r.c=s,a.c=s,{aliases:["pl","pm"],l:/[\w\.]+/,k:t,c:s}}),e.registerLanguage("php",function(e){var t={b:"\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"},r={cN:"meta",b:/<\?(php)?|\?>/},a={cN:"string",c:[e.BE,r],v:[{b:'b"',e:'"'},{b:"b'",e:"'"},e.inherit(e.ASM,{i:null}),e.inherit(e.QSM,{i:null})]},n={v:[e.BNM,e.CNM]};return{aliases:["php3","php4","php5","php6"],cI:!0,k:"and include_once list abstract global private echo interface as static endswitch array null if endwhile or const for endforeach self var while isset public protected exit foreach throw elseif include __FILE__ empty require_once do xor return parent clone use __CLASS__ __LINE__ else break print eval new catch __METHOD__ case exception default die require __FUNCTION__ enddeclare final try switch continue endfor endif declare unset true false trait goto instanceof insteadof __DIR__ __NAMESPACE__ yield finally",c:[e.HCM,e.C("//","$",{c:[r]}),e.C("/\\*","\\*/",{c:[{cN:"doctag",b:"@[A-Za-z]+"}]}),e.C("__halt_compiler.+?;",!1,{eW:!0,k:"__halt_compiler",l:e.UIR}),{cN:"string",b:/<<<['"]?\w+['"]?$/,e:/^\w+;?$/,c:[e.BE,{cN:"subst",v:[{b:/\$\w+/},{b:/\{\$/,e:/\}/}]}]},r,{cN:"keyword",b:/\$this\b/},t,{b:/(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{cN:"function",bK:"function",e:/[;{]/,eE:!0,i:"\\$|\\[|%",c:[e.UTM,{cN:"params",b:"\\(",e:"\\)",c:["self",t,e.CBCM,a,n]}]},{cN:"class",bK:"class interface",e:"{",eE:!0,i:/[:\(\$"]/,c:[{bK:"extends implements"},e.UTM]},{bK:"namespace",e:";",i:/[\.']/,c:[e.UTM]},{bK:"use",e:";",c:[e.UTM]},{b:"=>"},a,n]}}),e.registerLanguage("python",function(e){var t={keyword:"and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10 None True False",built_in:"Ellipsis NotImplemented"},r={cN:"meta",b:/^(>>>|\.\.\.) /},a={cN:"subst",b:/\{/,e:/\}/,k:t,i:/#/},n={cN:"string",c:[e.BE],v:[{b:/(u|b)?r?'''/,e:/'''/,c:[r],r:10},{b:/(u|b)?r?"""/,e:/"""/,c:[r],r:10},{b:/(fr|rf|f)'''/,e:/'''/,c:[r,a]},{b:/(fr|rf|f)"""/,e:/"""/,c:[r,a]},{b:/(u|r|ur)'/,e:/'/,r:10},{b:/(u|r|ur)"/,e:/"/,r:10},{b:/(b|br)'/,e:/'/},{b:/(b|br)"/,e:/"/},{b:/(fr|rf|f)'/,e:/'/,c:[a]},{b:/(fr|rf|f)"/,e:/"/,c:[a]},e.ASM,e.QSM]},i={cN:"number",r:0,v:[{b:e.BNR+"[lLjJ]?"},{b:"\\b(0o[0-7]+)[lLjJ]?"},{b:e.CNR+"[lLjJ]?"}]},s={cN:"params",b:/\(/,e:/\)/,c:["self",r,i,n]};return a.c=[n,i,r],{aliases:["py","gyp"],k:t,i:/(<\/|->|\?)|=>/,c:[r,i,n,e.HCM,{v:[{cN:"function",bK:"def"},{cN:"class",bK:"class"}],e:/:/,i:/[${=;\n,]/,c:[e.UTM,s,{b:/->/,eW:!0,k:"None"}]},{cN:"meta",b:/^[\t ]*@/,e:/$/},{b:/\b(print|exec)\(/}]}}),e.registerLanguage("ruby",function(e){
var t="[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?",r={keyword:"and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",literal:"true false nil"},a={cN:"doctag",b:"@[A-Za-z]+"},n={b:"#<",e:">"},i=[e.C("#","$",{c:[a]}),e.C("^\\=begin","^\\=end",{c:[a],r:10}),e.C("^__END__","\\n$")],s={cN:"subst",b:"#\\{",e:"}",k:r},c={cN:"string",c:[e.BE,s],v:[{b:/'/,e:/'/},{b:/"/,e:/"/},{b:/`/,e:/`/},{b:"%[qQwWx]?\\(",e:"\\)"},{b:"%[qQwWx]?\\[",e:"\\]"},{b:"%[qQwWx]?{",e:"}"},{b:"%[qQwWx]?<",e:">"},{b:"%[qQwWx]?/",e:"/"},{b:"%[qQwWx]?%",e:"%"},{b:"%[qQwWx]?-",e:"-"},{b:"%[qQwWx]?\\|",e:"\\|"},{b:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/},{b:/<<(-?)\w+$/,e:/^\s*\w+$/}]},o={cN:"params",b:"\\(",e:"\\)",endsParent:!0,k:r},l=[c,n,{cN:"class",bK:"class module",e:"$|;",i:/=/,c:[e.inherit(e.TM,{b:"[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"}),{b:"<\\s*",c:[{b:"("+e.IR+"::)?"+e.IR}]}].concat(i)},{cN:"function",bK:"def",e:"$|;",c:[e.inherit(e.TM,{b:t}),o].concat(i)},{b:e.IR+"::"},{cN:"symbol",b:e.UIR+"(\\!|\\?)?:",r:0},{cN:"symbol",b:":(?!\\s)",c:[c,{b:t}],r:0},{cN:"number",b:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",r:0},{b:"(\\$\\W)|((\\$|\\@\\@?)(\\w+))"},{cN:"params",b:/\|/,e:/\|/,k:r},{b:"("+e.RSR+"|unless)\\s*",k:"unless",c:[n,{cN:"regexp",c:[e.BE,s],i:/\n/,v:[{b:"/",e:"/[a-z]*"},{b:"%r{",e:"}[a-z]*"},{b:"%r\\(",e:"\\)[a-z]*"},{b:"%r!",e:"![a-z]*"},{b:"%r\\[",e:"\\][a-z]*"}]}].concat(i),r:0}].concat(i);s.c=l,o.c=l;var u="[>?]>",d="[\\w#]+\\(\\w+\\):\\d+:\\d+>",b="(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>",p=[{b:/^\s*=>/,starts:{e:"$",c:l}},{cN:"meta",b:"^("+u+"|"+d+"|"+b+")",starts:{e:"$",c:l}}];return{aliases:["rb","gemspec","podspec","thor","irb"],k:r,i:/\/\*/,c:i.concat(p).concat(l)}}),e.registerLanguage("shell",function(e){return{aliases:["console"],c:[{cN:"meta",b:"^\\s{0,3}[\\w\\d\\[\\]()@-]*[>%$#]",starts:{e:"$",sL:"bash"}}]}}),e.registerLanguage("sql",function(e){var t=e.C("--","$");return{cI:!0,i:/[<>{}*#]/,c:[{bK:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment",e:/;/,eW:!0,l:/[\w\.]+/,k:{keyword:"abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias allocate allow alter always analyze ancillary and any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second section securefile security seed segment select self sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",literal:"true false null",built_in:"array bigint binary bit blob boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text varchar varying void"},c:[{cN:"string",b:"'",e:"'",c:[e.BE,{b:"''"}]},{cN:"string",b:'"',e:'"',c:[e.BE,{b:'""'}]},{cN:"string",b:"`",e:"`",c:[e.BE]},e.CNM,e.CBCM,t]},e.CBCM,t]}}),e});
!function(n,e){"use strict";function t(){var n=e.createElement("style");n.type="text/css",n.innerHTML=h(".{0}{border-collapse:collapse}.{0} td{padding:0}.{1}:before{content:attr({2})}",[f,m,j]),e.getElementsByTagName("head")[0].appendChild(n)}function r(t){"complete"===e.readyState?l(t):n.addEventListener("DOMContentLoaded",function(){l(t)})}function l(t){try{var r=e.querySelectorAll("code.hljs");for(var l in r)r.hasOwnProperty(l)&&i(r[l],t)}catch(o){n.console.error("LineNumbers error: ",o)}}function i(n,e){if("object"==typeof n){e=e||{singleLine:!1};var t=e.singleLine?0:1;u(function(){s(n),n.innerHTML=o(n.innerHTML,t)})}}function o(n,e){var t=c(n);if(""===t[t.length-1].trim()&&t.pop(),t.length>e){for(var r="",l=0,i=t.length;l<i;l++)r+=h('<tr><td class="{0}"><div class="{1} {2}" {3}="{5}"></div></td><td class="{4}"><div class="{1}">{6}</div></td></tr>',[v,g,m,j,p,l+1,t[l].length>0?t[l]:" "]);return h('<table class="{0}">{1}</table>',[f,r])}return n}function s(n){var e=n.childNodes;for(var t in e)if(e.hasOwnProperty(t)){var r=e[t];d(r.textContent)>0&&(r.childNodes.length>0?s(r):a(r.parentNode))}}function a(n){var e=n.className;if(/hljs-/.test(e)){for(var t=c(n.innerHTML),r=0,l="";r<t.length;r++)l+=h('<span class="{0}">{1}</span>\n',[e,t[r]]);n.innerHTML=l.trim()}}function c(n){return 0===n.length?[]:n.split(L)}function d(n){return(n.trim().match(L)||[]).length}function u(e){n.setTimeout(e,0)}function h(n,e){return n.replace(/\{(\d+)\}/g,function(n,t){return e[t]?e[t]:n})}var f="hljs-ln",g="hljs-ln-line",p="hljs-ln-code",v="hljs-ln-numbers",m="hljs-ln-n",j="data-line-number",L=/\r\n|\r|\n/g;n.hljs?(n.hljs.initLineNumbersOnLoad=r,n.hljs.lineNumbersBlock=i,t()):n.console.error("highlight.js not detected!")}(window,document);
/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 1.6.7
 * @requires jQuery >=1.5.0 <4.0
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2019, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowPast: true,
      allowFuture: false,
      localeTitle: false,
      cutoff: 0,
      autoDispose: true,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        inPast: 'any moment now',
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },

    inWords: function(distanceMillis) {
      if (!this.settings.allowPast && ! this.settings.allowFuture) {
          throw 'timeago allowPast and allowFuture settings can not both be set to false.';
      }

      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      if (!this.settings.allowPast && distanceMillis >= 0) {
        return this.settings.strings.inPast;
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator || "";
      if ($l.wordSeparator === undefined) { separator = " "; }
      return $.trim([prefix, words, suffix].join(separator));
    },

    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      s = s.replace(/([\+\-]\d\d)$/," $100"); // +09 -> +0900
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  // functions that can be called via $(el).timeago('action')
  // init is default when no action is given
  // functions are called with context of a single element
  var functions = {
    init: function() {
      functions.dispose.call(this);
      var refresh_el = $.proxy(refresh, this);
      refresh_el();
      var $s = $t.settings;
      if ($s.refreshMillis > 0) {
        this._timeagoInterval = setInterval(refresh_el, $s.refreshMillis);
      }
    },
    update: function(timestamp) {
      var date = (timestamp instanceof Date) ? timestamp : $t.parse(timestamp);
      $(this).data('timeago', { datetime: date });
      if ($t.settings.localeTitle) {
        $(this).attr("title", date.toLocaleString());
      }
      refresh.apply(this);
    },
    updateFromDOM: function() {
      $(this).data('timeago', { datetime: $t.parse( $t.isTime(this) ? $(this).attr("datetime") : $(this).attr("title") ) });
      refresh.apply(this);
    },
    dispose: function () {
      if (this._timeagoInterval) {
        window.clearInterval(this._timeagoInterval);
        this._timeagoInterval = null;
      }
    }
  };

  $.fn.timeago = function(action, options) {
    var fn = action ? functions[action] : functions.init;
    if (!fn) {
      throw new Error("Unknown function name '"+ action +"' for timeago");
    }
    // each over objects here and call the requested function
    this.each(function() {
      fn.call(this, options);
    });
    return this;
  };

  function refresh() {
    var $s = $t.settings;

    //check if it's still visible
    if ($s.autoDispose && !$.contains(document.documentElement,this)) {
      //stop if it has been removed
      $(this).timeago("dispose");
      return this;
    }

    var data = prepareData(this);

    if (!isNaN(data.datetime)) {
      if ( $s.cutoff === 0 || Math.abs(distance(data.datetime)) < $s.cutoff) {
        $(this).text(inWords(data.datetime));
      } else {
        if ($(this).attr('title').length > 0) {
            $(this).text($(this).attr('title'));
        }
      }
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if ($t.settings.localeTitle) {
        element.attr("title", element.data('timeago').datetime.toLocaleString());
      } else if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}));

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof module === "object" && typeof module.exports === "object") {
    factory(require("jquery"));
  } else {
    factory(jQuery);
  }
})(function(jQuery) {
  // Norwegian
  jQuery.timeago.settings.strings = {
    prefixAgo: "",
    prefixFromNow: "om",
    suffixAgo: "",
    suffixFromNow: "",
    seconds: "mindre enn et minutt",
    minute: "ca. et minutt",
    minutes: "%d minutter",
    hour: "ca. en time",
    hours: "ca. %d timer",
    day: "en dag",
    days: "%d dager",
    month: "ca. en måned",
    months: "%d måneder",
    year: "ca. et år",
    years: "%d år"
  };
});

// LazyLoad
// written by Matt Evans @mattkatt

(function () {
  "use strict";
  var lazyload = {
    events: ["load", "orientationchange", "resize", "scroll"],
    setOffset: function (offset) {
      lazyload.offset = parseInt(offset, 10);
    },
    run: function () {
      var i,
        targets = document.querySelectorAll(".lazyload");

      if (targets.length > 0) {
        for (i = 0; i < targets.length; i++) {
          var elem = targets[i],
            list = elem.getAttribute("class").split(" "),
            lazyBG = list.indexOf("lazyBG"),
            src = elem.getAttribute("data-src"),
            set = elem.hasAttribute("data-srcset")
              ? elem.getAttribute("data-srcset")
              : null,
            rect = elem.getBoundingClientRect();
          if (typeof src === "string")
            src = src.replaceAll("http://", "https://");
          if (typeof set === "string")
            set = set.replaceAll("http://", "https://");
          if (
            rect.top <= window.innerHeight + lazyload.offset &&
            elem.offsetParent !== null
          ) {
            if (lazyBG > -1) {
              elem.style.backgroundImage = "url(" + src + ")";
            }

            if (lazyBG <= -1) {
              if (src) {
                elem.src = src;
              }

              if (set) {
                elem.srcset = set;
                elem.removeAttribute("data-srcset");
              }
              if (elem.tagName === "VIDEO") {
                elem.play();
              }
            }

            list.splice(list.indexOf("lazyload"), 1);
            elem.setAttribute("class", list.join(" "));
            elem.removeAttribute("data-src");
          }
        }
      } else {
        for (i = 0; i < lazyload.events.length; i++) {
          window.removeEventListener(lazyload.events[i], lazyload.run);
        }
      }
    },
    init: function (offset) {
      var script = document.querySelector("script#lazyloadjs");

      if (typeof offset !== "number") {
        offset = 200;
      }

      if (script && script.hasAttribute("data-offset")) {
        offset = script.getAttribute("data-offset");
      }

      lazyload.setOffset(offset);

      for (var j = 0; j < lazyload.events.length; j++) {
        window.addEventListener(lazyload.events[j], lazyload.run, false);
      }
      lazyload.run();
    },
  };
  $(() => {
    $(".lazyload").attr(
      "sizes",
      "(min-width: 700px) 700px, (min-width: 1024px) 1024px, (max-width: 700px) 100px"
    );
    lazyload.init(250);
  });
})();

/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.9.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
(function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)})(function(i){"use strict";var e=window.Slick||{};e=function(){function e(e,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(e),appendDots:i(e),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(e),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(e).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,"undefined"!=typeof document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):"undefined"!=typeof document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=t++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}var t=0;return e}(),e.prototype.activateADA=function(){var i=this;i.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):o===!0?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),s.options.rtl===!0&&s.options.vertical===!1&&(e=-e),s.transformsEnabled===!1?s.options.vertical===!1?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):s.cssTransitions===!1?(s.options.rtl===!0&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),s.options.vertical===!1?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),s.options.vertical===!1?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this,o=t.getNavTarget();null!==o&&"object"==typeof o&&o.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};e.options.fade===!1?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(i.options.infinite===!1&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1===0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;e.options.arrows===!0&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),e.options.infinite!==!0&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(o.options.dots===!0&&o.slideCount>o.options.slidesToShow){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),e.options.centerMode!==!0&&e.options.swipeToSlide!==!0||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.options.draggable===!0&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>0){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(r.originalSettings.mobileFirst===!1?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,e===!0&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||l===!1||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!==0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t,o=this;if(e=o.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var s in e){if(i<e[s]){i=t;break}t=e[s]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),e.options.accessibility===!0&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),e.options.accessibility===!0&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),e.options.accessibility===!0&&e.$list.off("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>0&&(i=e.$slides.children().children(),i.removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){var e=this;e.shouldClick===!1&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",e.options.fade===!1?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;t.cssTransitions===!1?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;e.cssTransitions===!1?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(t){var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&o.is(":focus")&&(e.focussed=!0,e.autoPlay())},0)}).on("blur.slick","*",function(t){i(this);e.options.pauseOnFocus&&(e.focussed=!1,e.autoPlay())})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){var i=this;return i.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(i.options.infinite===!0)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(i.options.centerMode===!0)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),n.options.infinite===!0?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,n.options.vertical===!0&&n.options.centerMode===!0&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!==0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),n.options.centerMode===!0&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:n.options.centerMode===!0&&n.options.infinite===!0?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:n.options.centerMode===!0&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=n.options.vertical===!1?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,n.options.variableWidth===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,n.options.centerMode===!0&&(o=n.slideCount<=n.options.slidesToShow||n.options.infinite===!1?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=n.options.rtl===!0?o[0]?(n.$slideTrack.width()-o[0].offsetLeft-o.width())*-1:0:o[0]?o[0].offsetLeft*-1:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){var e=this;return e.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(e.options.infinite===!1?i=e.slideCount:(t=e.options.slidesToScroll*-1,o=e.options.slidesToScroll*-1,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o,s,n=this;return s=n.options.centerMode===!0?Math.floor(n.$list.width()/2):0,o=n.swipeLeft*-1+s,n.options.swipeToSlide===!0?(n.$slideTrack.find(".slick-slide").each(function(e,s){var r,l,d;if(r=i(s).outerWidth(),l=s.offsetLeft,n.options.centerMode!==!0&&(l+=r/2),d=l+r,o<d)return t=s,!1}),e=Math.abs(i(t).attr("data-slick-index")-n.currentSlide)||1):n.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){var t=this;t.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),t.options.accessibility===!0&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);if(i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),s!==-1){var n="slick-slide-control"+e.instanceUid+s;i("#"+n).length&&i(this).attr({"aria-describedby":n})}}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.options.focusOnChange?e.$slides.eq(s).attr({tabindex:"0"}):e.$slides.eq(s).removeAttr("tabindex");e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),i.options.accessibility===!0&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;e.options.dots===!0&&e.slideCount>e.options.slidesToShow&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),e.options.accessibility===!0&&e.$dots.on("keydown.slick",e.keyHandler)),e.options.dots===!0&&e.options.pauseOnDotsHover===!0&&e.slideCount>e.options.slidesToShow&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),e.options.accessibility===!0&&e.$list.on("keydown.slick",e.keyHandler),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&e.options.accessibility===!0?e.changeSlide({data:{message:e.options.rtl===!0?"next":"previous"}}):39===i.keyCode&&e.options.accessibility===!0&&e.changeSlide({data:{message:e.options.rtl===!0?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||r.$slider.attr("data-sizes"),n=document.createElement("img");n.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),r.$slider.trigger("lazyLoaded",[r,e,t])})},n.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),r.$slider.trigger("lazyLoadError",[r,e,t])},n.src=t})}var t,o,s,n,r=this;if(r.options.centerMode===!0?r.options.infinite===!0?(s=r.currentSlide+(r.options.slidesToShow/2+1),n=s+r.options.slidesToShow+2):(s=Math.max(0,r.currentSlide-(r.options.slidesToShow/2+1)),n=2+(r.options.slidesToShow/2+1)+r.currentSlide):(s=r.options.infinite?r.options.slidesToShow+r.currentSlide:r.currentSlide,n=Math.ceil(s+r.options.slidesToShow),r.options.fade===!0&&(s>0&&s--,n<=r.slideCount&&n++)),t=r.$slider.find(".slick-slide").slice(s,n),"anticipated"===r.options.lazyLoad)for(var l=s-1,d=n,a=r.$slider.find(".slick-slide"),c=0;c<r.options.slidesToScroll;c++)l<0&&(l=r.slideCount-1),t=t.add(a.eq(l)),t=t.add(a.eq(d)),l--,d++;e(t),r.slideCount<=r.options.slidesToShow?(o=r.$slider.find(".slick-slide"),e(o)):r.currentSlide>=r.slideCount-r.options.slidesToShow?(o=r.$slider.find(".slick-cloned").slice(0,r.options.slidesToShow),e(o)):0===r.currentSlide&&(o=r.$slider.find(".slick-cloned").slice(r.options.slidesToShow*-1),e(o))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){var i=this;i.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;if(!t.unslicked&&(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),t.options.accessibility===!0&&(t.initADA(),t.options.focusOnChange))){var o=i(t.$slides.get(t.currentSlide));o.attr("tabindex",0).focus()}},e.prototype.prev=e.prototype.slickPrev=function(){var i=this;i.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),r=document.createElement("img"),r.onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),l.options.adaptiveHeight===!0&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),e.options.focusOnSelect===!0&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;return"boolean"==typeof i?(e=i,i=e===!0?0:o.slideCount-1):i=e===!0?--i:i,!(o.slideCount<1||i<0||i>o.slideCount-1)&&(o.unload(),t===!0?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,void o.reinit())},e.prototype.setCSS=function(i){var e,t,o=this,s={};o.options.rtl===!0&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,o.transformsEnabled===!1?o.$slideTrack.css(s):(s={},o.cssTransitions===!1?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;i.options.vertical===!1?i.options.centerMode===!0&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),i.options.centerMode===!0&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),i.options.vertical===!1&&i.options.variableWidth===!1?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):i.options.variableWidth===!0?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();i.options.variableWidth===!1&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,t.options.rtl===!0?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&i.options.adaptiveHeight===!0&&i.options.vertical===!1){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":"undefined"!=typeof arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),i.options.fade===!1?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=i.options.vertical===!0?"top":"left",
"top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||i.options.useCSS===!0&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&i.animType!==!1&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&i.animType!==!1},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),n.options.centerMode===!0){var r=n.options.slidesToShow%2===0?1:0;e=Math.floor(n.options.slidesToShow/2),n.options.infinite===!0&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=n.options.infinite===!0?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(s.options.fade===!0&&(s.options.centerMode=!1),s.options.infinite===!0&&s.options.fade===!1&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=s.options.centerMode===!0?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));return s||(s=0),t.slideCount<=t.options.slidesToShow?void t.slideHandler(s,!1,!0):void t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(a.animating===!0&&a.options.waitForAnimate===!0||a.options.fade===!0&&a.currentSlide===i))return e===!1&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,a.options.infinite===!1&&a.options.centerMode===!1&&(i<0||i>a.getDotCount()*a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):a.options.infinite===!1&&a.options.centerMode===!0&&(i<0||i>a.slideCount-a.options.slidesToScroll)?void(a.options.fade===!1&&(o=a.currentSlide,t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o))):(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!==0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!==0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=a.getNavTarget(),l=l.slick("getSlick"),l.slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide)),a.updateDots(),a.updateArrows(),a.options.fade===!0?(t!==!0?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight()):void(t!==!0&&a.slideCount>a.options.slidesToShow?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)))},e.prototype.startLoad=function(){var i=this;i.options.arrows===!0&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),i.options.dots===!0&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),o=Math.round(180*t/Math.PI),o<0&&(o=360-Math.abs(o)),o<=45&&o>=0?s.options.rtl===!1?"left":"right":o<=360&&o>=315?s.options.rtl===!1?"left":"right":o>=135&&o<=225?s.options.rtl===!1?"right":"left":s.options.verticalSwiping===!0?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(o.touchObject.edgeHit===!0&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(e.options.swipe===!1||"ontouchend"in document&&e.options.swipe===!1||e.options.draggable===!1&&i.type.indexOf("mouse")!==-1))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,e.options.verticalSwiping===!0&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(l.options.verticalSwiping===!0&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(l.options.rtl===!1?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),l.options.verticalSwiping===!0&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,l.options.infinite===!1&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),l.options.vertical===!1?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,l.options.verticalSwiping===!0&&(l.swipeLeft=e+o*s),l.options.fade!==!0&&l.options.touchMove!==!1&&(l.animating===!0?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;return t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow?(t.touchObject={},!1):(void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,void(t.dragging=!0))},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i,e=this;i=Math.floor(e.options.slidesToShow/2),e.options.arrows===!0&&e.slideCount>e.options.slidesToShow&&!e.options.infinite&&(e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===e.currentSlide?(e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-e.options.slidesToShow&&e.options.centerMode===!1?(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):e.currentSlide>=e.slideCount-1&&e.options.centerMode===!0&&(e.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),e.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||"undefined"==typeof s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),"undefined"!=typeof t)return t;return o}});