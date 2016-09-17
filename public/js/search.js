$(function(){
	$("#search").keyup(function(){
		var searchTerm = $(this).val()

		$.get("/product/search-api?q="+searchTerm,function(data){
			console.log(data)
			if(data.empty){
				window.location="/"
			}

			$("#searchResults").empty()
			$("#pag").empty()
			var html =""
			for(var i in data){
				var d=data[i];
				html+=`<div class="col-md-3">
			
			<a href="/product/show/${d._id}">
				<span class="thumbnail">
					<img src="${d._source.image}" alt="">
					<span class="caption">
						<h3>${d._source.name} </h3>
						<p>${d._source.price} </p>
					</span>

				</span>

			</a>

		</div>`
			}
			$("#searchResults").append(html)

		})
	})
})