const helper = require('./helper.js');
//import 'bootstrap';

// Helpers
// Code is borrowed from the homeworks since creating a product requires some similar features.
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
    return (
        <div>
            <h1 id="productFormTitle">Create Your Product</h1>
            <form id="productForm"
             onSubmit={createProduct}
             name="productForm"
             action="/createProduct"
             method="POST"
             className="productForm"
            >
            <label htmlFor="name"><h2>Name:</h2></label>
            <input id="productName" name="name" type="text" placeholder="Product Name" />
            <br/>
            <label htmlFor="description">
            <h2>Description:</h2>
            <textarea id="productDescription" name="description" type="text" />
            </label>
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
            <div key={product._id} className="marketItem" >
                <img src="/assets/img/shopping-cart.png" alt="featured product" width="50px" className="productImage" />
                <h2 className="productName">{product.name}</h2>
                <h3 className="productCreator">{product.user}</h3>
                <button className="addToCart" onClick={()=> {
                    console.log(product);
                    helper.sendPost('addToCart', {product}, () => console.log("Added to cart!"));
                }}>Add To Cart</button>
            </div>
        );
    });
    return (
        <div className="productList">
            {productItems}
        </div>
    );
}
// Loads products of given api call

  const loadProducts = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }


  //Search bar will allow you to look up products by name
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
            return (
                <div>Test</div>
            )
        } else {
            return (
                <div>We couldn't find anything by that name.</div>
            )
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

// Deletes a product based on its id. Never uses a name for mongoose to find
// since names can be similar or different users can be selling the same product.
const deleteProduct = async (params) => {
    const deleteData = await fetch(`/deleteProduct/?id=${params}`);
    const data = deleteData.json();
    console.log(data);
    return null;
}
// Loads the user's products
const UserProducts = (fields) => {
    const userProductItems = fields.props.props.userProducts.map(product => {
        return(
        <div key={product._id} className='marketItem'>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <button id="deleteButton" onClick={() => deleteProduct(product._id)}>Delete Product</button>
        </div>
        )
    }); 

    return (
        <div>
            {userProductItems}
        </div>
    )
}

const GoPremium = () => {
    const [handlePremium, setPremium] = React.useState(false);

    const getPremiumStatus = async() => {
        fetch('/getPremiumStatus').then(response => response.json())
        .then(data => {
            if (data[0].isPremium) {
                setPremium(true);
            } else if (!data[0].isPremium) {
                setPremium(false);
            }
        });
    }

    const upgrade = async() => {
        fetch('/upgrade').then(() => {setPremium(true)});
    }
    const downgrade = async() => {
        fetch('/downgrade').then(() => {setPremium(false)});
    }
    getPremiumStatus();
    if (!handlePremium) {
        return (
            <div>
                <button onClick={async() => {
                    upgrade();
                }}>Upgrade to Premium</button>
            </div>
        )
    }
    if (handlePremium) {
        return (
            <div>
                <button onClick={async() => {
                    downgrade();         
                }}>Cancel Plan</button>
            </div>
        )
    }
}
// The main component handles what the user sees below the nav bar. 
const MainComponent = (fields) => {
    //We need a way of switching between viewing the market and creating a product.
    //These react hooks will determine what is currently rendered and what is not.
    const [loadproducts, setLoadProducts] = React.useState(true);
    const [createproducts, setCreateProducts] = React.useState(false);
    const [showuserproducts, setUser] = React.useState(false);

    if (loadproducts) {
      return (
          <div>
              <button id="create-product" onClick={()=> {
                  setLoadProducts(false);
                  setCreateProducts(true);
              }}>Create Product</button>
              <button id="load-user" onClick={() => {
                setUser(true);
                setLoadProducts(false);
                setCreateProducts(false);
              }}>Your Products</button>
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
         <button id="load-user" onClick={() => {
                setUser(true);
                setLoadProducts(false);
                setCreateProducts(false);
              }}>Your Products</button>
          <CreateProduct props={fields}/>
        </div>
      )
    }
    if (showuserproducts) {
        return (
            <div>
            <button id="create-product" onClick={()=> {
                  setLoadProducts(false);
                  setCreateProducts(true);
                  setUser(false);
              }}>Create Product</button>
            <button id="marketplace" onClick={()=> {
              setLoadProducts(true);
              setCreateProducts(false);
              setUser(false);
             }}>To Marketplace</button>

           <h1>Your products</h1>
             <UserProducts props={fields}/>
            </div>
        )
    }

}

// Init is called when the window loads. The get product api calls are loaded before the user 
// can react with the page.
const init = async () => {
    const response = await fetch('/getToken');
    const data = await response.json();
    const products = await loadProducts('/getProducts');
    const userProducts = await loadProducts('/getUserProducts');
    const obj = {
        data,
        products,
        userProducts
    }
    
    ReactDOM.render(<MainComponent props={obj}/>, document.getElementById('main'));
    ReactDOM.render(<SearchBar />, document.querySelector('.searchBar'));
    ReactDOM.render(<GoPremium />, document.querySelector('.premium'));
}

window.onload = init;