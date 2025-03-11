import coin from "../assets/store/coin.png";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { products } from "../utils/ProductsData";

const RedeemComponent = () => {
  const { user } = useAuthStore();
  const points = user?.points;

  return (
    <div className="flex justify-center">
      <div className="grid w-[85%] lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10 p-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            {/* Image Section */}
            <div className="bg-white flex justify-center h-[200px]">
              <img
                src={product.image}
                alt={product.title}
                className="h-[180px] w-[180px] object-contain"
              />
            </div>

            {/* Details Section */}
            <div className="flex justify-between items-center p-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-sm">{product.subtitle}</p>
              </div>
              {/* Points Badge */}
              <Link
                to={`/placeorder?id=${product.id}&title=${encodeURIComponent(
                  product.title
                )}&image=${encodeURIComponent(product.image)}&points=${
                  product.points
                }`}
              >
                <button
                  disabled={points > product.points}
                  className={`flex items-center ${
                    points < product.points ? "bg-[#cfb692]" : "bg-[#e19933]"
                  }  h-10 text-white px-3 py-1 rounded-lg text-sm`}
                >
                  {product.points}
                  <img
                    src={coin}
                    alt="coin"
                    className="h-[15px] w-[15px] ml-1"
                  />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RedeemComponent;
