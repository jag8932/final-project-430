const helper = require('./helper.js');

// Helper functions

const createProduct = (e) => {
    e.preventDefault();

    const name = e.target.querySelector('#productName').value;
    const description = e.target.querySelector('#productDescription').value;
    const _csrf = e.target.querySelector('#_csrf').value;

      if (!name || !description) {
          helper.handleError("A name and description are required for this product.");
          return false;
      }

      helper.sendPost(e.target.action, {name, description, _csrf}, () => {console.log("Product Created!")});
      return false;
  }


// Components

// User gives a name and a description and the server detects who is creating the product
const CreateProduct = (props) => {
    return (
        <div>
            <h1>Welcome to the market.</h1>
            <form id="productForm"
             onSubmit={createProduct}
             name="productForm"
             action="/createProduct"
             method="POST"
             className="productForm"
            >
            <label htmlFor="name">Name:</label>
            <input id="productName" name="name" type="text" placeholder="Product Name" />
            <label htmlFor="description">Description:</label>
            <input id="productDescription" name="description" type="text" />
            <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
            <input className="createProductSubmit" type="submit" value="Create Product"/>
            </form>
        </div>
    )
}
//Code is borrowed from the homeworks
const ProductList = (props) => {
    if (props.products.length === 0) {
        return (
            <div>
                <h3 className="emptyMarket">The marketplace is empty. Fix that by selling something!</h3>
            </div>
        );
    }

    const productItems = props.products.map(product => {
        return (
            <div key={product._id} className="col" >
                <img src="/assets/img/shopping-cart.png" alt="featured product" width="50px" className="productImage" />
                <h2 className="productName">{product.name}</h2>
                <h3 className="productCreator">{product.user}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {productItems}
        </div>
    );
}

  // Borrowed from homework to load products.
  const loadProducts = async () => {
    const response = await fetch('/getProducts');
    const data = await response.json();
    console.log(data);
    if (data) {
        ReactDOM.render(
            <ProductList products={data} />,
            document.getElementById('market')
        );
    }
  }

const SearchBar = () => {
    const searchProduct = async (e) => {
        e.preventDefault();

        const search = e.target.querySelector('#searchInput').value;
        if (search) {
            if (search.length < 1) {
                helper.handleError("Must search for an actual product.");
            } 
        const result = await fetch(`searchFor/?search=${search}`)
                .then(response => response.json());
        console.log(result);
        if (result) {
            document.getElementById("showResults").innerHTML = JSON.stringify(result);
        } else {
            document.getElementById("showResults").innerHTML = "No results found";
        }
        }
    }

    return (
        <div className="search">
            <form id="searchForm"
            onSubmit={searchProduct}
            name="searchForm"
            action="/searchFor"
            method="GET"
            className="searchForm"
            >
            <div className="searchInputContainer">
            <input type="text" id="searchInput" className="searchInput" placeholder="Search for a product..."/>
            <div className="searchImageHandler">
                <input className="searchProductSubmit" name="submit" type="image" src="/assets/img/search-icon.png" alt="submit"/>
            </div>
            </div>
            </form>
            <div id="showResults"></div>
        </div>
    )
}
/*
const Main = (props) => {
    const result = React.useState();
    
} */
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();

    ReactDOM.render(<SearchBar/>, document.querySelector('.searchBar'));
 //   ReactDOM.render(<CreateProduct csrf={data.csrfToken}/>, document.getElementById('market'));
    loadProducts();
    //ReactDOM.render(<Main />, document.getElementById('bottomPage'));
}

window.onload = init;