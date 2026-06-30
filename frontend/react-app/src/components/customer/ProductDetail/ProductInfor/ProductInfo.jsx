import Price from "./Price";
import ColorSelector from "./HeadphoneSelector";
import ActionButtons from "./ActionButtons";
import Description from "./Description";
import ExtraInfo from "./ExtraInfo";
import Tags from "./Tags";

export default function ProductInfo() {
  return (
    <div>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-3">
        <img src="https://i.pinimg.com/736x/e6/fd/cc/e6fdccc7d859460f81401b2927a62f50.jpg" className="w-8 h-8 rounded-full" />
        <a className="text-xl font-semibold hover:text-[#FFCC00]">HP</a>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-white">
        Tai nghe Wireless Pro
      </h1>

      <Price />
      <ColorSelector />
      <ActionButtons />
      <Description />
      <ExtraInfo />
      <Tags />

    </div>
  );
}