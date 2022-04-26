const helper = require('./helper.js');

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
      location.reload();
}
// Components

// User gives a name and a description and the server detects who is creating the product
const CreateProduct = (fields) => {
    console.log(fields.props.props);
    return (
        <div>
            <h1>Create Your Product</h1>
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
            <input id="_csrf" type="hidden" name="_csrf" value={fields.props.props.data.csrfToken} />
            <input className="createProductSubmit" type="submit" value="Create Product"/>
            </form>
        </div>
    )
}

//Code is borrowed from the homeworks
const ProductList = (fields) => {
    if (fields.props.products.length === 0) {
        return (
            <div>
                <h3 className="emptyMarket">The marketplace is empty. Fix that by selling something!</h3>
            </div>
        );
    }
    const productItems = fields.props.products.map(product => {
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
  /*
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
  } */

  const loadProducts = async () => {
    const response = await fetch('/getProducts');
    const data = await response.json();
    return data;
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
        </div>
    )
}

const MainComponent = (fields) => {
    //We need a way of switching between viewing the market and creating a product.
    //These react hooks will determine what is currently rendered and what is not.
    const [loadproducts, setLoadProducts] = React.useState(true);
    const [createproducts, setCreateProducts] = React.useState(false);

    if (loadproducts) {
      return (
          <div>
              <button id="create-product" onClick={()=> {
                  setLoadProducts(false);
                  setCreateProducts(true);
              }}>Create Product</button>
              <ProductList props={fields.props}/>
          </div>
      )
    }
    if (createproducts) {
      return (
        <div>
          <button id="marketplace" onClick={()=> {
              setLoadProducts(true);
              setCreateProducts(false);
          }}>To Marketplace</button>
          <CreateProduct props={fields}/>
        </div>
      )
    }

}

const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
    const products = await loadProducts();
    const obj = {
        data,
        products
    }
    ReactDOM.render(<MainComponent props={obj}/>, document.getElementById('main'));
    ReactDOM.render(<SearchBar />, document.querySelector('.searchBar'));
}

window.onload = init;