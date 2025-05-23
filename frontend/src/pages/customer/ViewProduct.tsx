import { Fragment, useState, useEffect } from 'react';
// import sidebarLogo from '../../assets/images/sanskar-logo.png';
import Modalsearch from "../../components/common/modalsearch/modalsearch";
import { useParams } from 'react-router-dom';

import axios from 'axios';
// import { API_KEY, API_SECRET, BASE_URL } from "../../utils/constants";

// interface ProductDetails {
//   product_name: string;
//   category: string;
//   description: string;
//   product_images?: string;
// }

const Productdetails = () => {
  const [fullScreen, setFullScreen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<any>(null);
  const [logo, setLogo] = useState("/assets/frappe/images/frappe-framework-logo.svg"); 
  const [loading, setLoading] = useState(true);

  // Extract product_id from URL parameters
  // const urlParams = new URLSearchParams(window.location.search);
  // const productId = urlParams.get('product_id');
  const { product_id: productId } = useParams<{ product_id: string }>();

  useEffect(() => {
    document.title='View Product';

    const fetchWebsiteSettings = async () => {
      try {
        const response = await axios.get('/api/method/reward_management.api.website_settings.get_website_settings');
        // console.log('API Image Response:', response.data);

        // Check if the response is successful and contains the expected structure
        if (response && response.data && response.data.message && response.data.message.status === 'success') {
          const { banner_image } = response.data.message.data;

          // If banner_image exists, set it as the logo
          if (banner_image) {
            const fullBannerImageURL = `${window.origin}${banner_image}`;
             // Set the banner image as the logo
            setLogo(fullBannerImageURL);
            // console.log('Banner Image Set:', fullBannerImageURL);
          } else {
            // console.log('No banner_image found, using default logo.');
            setLogo("/assets/frappe/images/frappe-framework-logo.svg"); 
          }
        } else {
          console.error('API response was not successful:', response.data.message);
          setLogo("/assets/frappe/images/frappe-framework-logo.svg"); 
        }
      } catch (error) {
        console.error('Error fetching website settings:', error);
        setLogo("/assets/frappe/images/frappe-framework-logo.svg"); 
      } finally {
        setLoading(false); 
      }
    };

    fetchWebsiteSettings();

    
    if (!productId) {
      console.error('No product ID found in URL');
      return;
    }

    const fetchProductDetails = async () => {
      try {
        // const response = await axios.get(`/api/method/reward_management.api.product_master.get_product_details?product_id=${productId}`, {
        // });
        const response = await axios.get(`/api/method/reward_management.api.product_master.get_product_details`, {
          params: { product_id: productId }
        });
        // console.log("data product card", response);
        setProductDetails(response.data.message.message);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleOpenSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullScreen(!fullScreen);
  };

  if (loading) {
   
   
    return <div className='' ></div>; 
}

  return (
    <Fragment>
      <header className="bg-white border border-defaultborder border-b-2">
        <nav className="main-header h-[3.75rem] mx-20">
          <div className="main-header-container pe-[1rem]">
            <div className="header-content-left">
              <div className="header-element md:px-[0.325rem] flex items-center">
              <img src={logo} alt="Sidebar Logo" className="sidebar-logo w-18 h-10" />
              </div>
            </div>
            <div className="header-content-right flex items-center">
              <div className="header-element py-[1rem] md:px-[0.65rem] px-2 header-search">
                <button
                  aria-label="Search"
                  type="button"
                  onClick={handleOpenSearchModal}
                  className="inline-flex flex-shrink-0 justify-center items-center gap-2 rounded-full font-medium focus:ring-offset-0 focus:ring-offset-white transition-all text-xs dark:bg-bgdark dark:hover:bg-black/20 dark:text-[#8c9097] dark:text-white/50 dark:hover:text-white dark:focus:ring-white/10 dark:focus:ring-offset-white/10"
                >
                  <i className="bx bx-search-alt-2 header-link-icon"></i>
                </button>
              </div>
              <div className="header-element py-[1rem] md:px-[0.65rem] px-2">
                <button className="header-btn" onClick={toggleFullScreen}>
                  <i className={`header-link-icon bx ${fullScreen ? 'bx-exit-fullscreen' : 'bx-fullscreen'}`}></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="grid grid-cols-12 gap-6 mt-4 mx-20">
        <div className="xl:col-span-12 col-span-12">
          <div className="">
            <div className="box-body">
              <div className="sm:grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-5 xl:col-span-12 col-span-12">
                  <div className="bg-light h-full">
                    {productDetails?.product_images ? (
                      <img
                        className="object-cover w-full"
                        // Concatenate with base URL if needed
                        src={`${productDetails.product_images}`} 
                        alt={productDetails.product_name}
                      />
                    ) : (
                      <p>No image available</p>
                    )}
                  </div>
                </div>
                <div className="xxl:col-span-7 xl:col-span-12 col-span-12">
                  {productDetails ? (
                    <div className="md:grid grid-cols-12 gap-x-3">
                      <div className="xl:col-span-12 col-span-12 mt-4">
                        <div className="mb-4">
                          <p className="text-[.9375rem] font-semibold mb-1">Description :</p>
                          <p className="text-[#8c9097] dark:text-white/50 mb-0">
                            <div dangerouslySetInnerHTML={{ __html: productDetails.description }} />
                          </p>
                        </div>
                        <div className="mb-4">
                          <p className="text-[.9375rem] font-semibold mb-2">Product Details :</p>
                          <div className="table-responsive min-w-full">
                            <table className="table table-bordered whitespace-nowrap w-full">
                              <tbody>
                                <tr className="border border-defaultborder dark:border-defaultborder/10">
                                  <th scope="row" className="font-semibold text-start">Product Name</th>
                                  <td>{productDetails.product_name}</td>
                                </tr>
                                <tr className="border border-defaultborder dark:border-defaultborder/10">
                                  <th scope="row" className="font-semibold text-start">Category</th>
                                  <td>{productDetails.category}</td>
                                </tr>

                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Loading product details...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modalsearch isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
    </Fragment>
  );
};

export default Productdetails;
