import React from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";

const Form = () => {
  return (
    <div className="w-[853px] h-[3534px]">
      <div></div>
      <div className="w-[853px] h-[1775px]">
        <div className="w-[496px] h-[1775px] pt-8 pb-8 pl-4 pr-4">
          <div>
            <h1>Include Some Details</h1>
          </div>
          <div>
            <p>
              Type <sup>*</sup>
            </p>
            <div>
              <button>Flats/Apartments</button>
              <button>Independent/Builder Floors</button>
            </div>
            <div>
              <button>Farm House</button>
              <button>House & Villa</button>
            </div>
          </div>
          <div>
            <p>BHK</p>
            <div>
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>4+</button>
            </div>
          </div>
          <div>
            <p>Bathroom</p>
            <div>
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>4+</button>
            </div>
          </div>
          <div>
            <p>Furnishing</p>
            <div>
              <button>Furnished</button>
              <button>Unfurnished</button>
              <button>Semi-Furnished</button>
            </div>
          </div>
          <div>
            <p>Project Status</p>
            <div>
              <button>New Launch</button>
              <button>Ready to Move</button>
              <button>Under Construction</button>
            </div>
          </div>
          <div>
            <p>Listed By</p>
            <div>
              <button>Builder</button>
              <button>Dealer</button>
              <button>Owner</button>
            </div>
          </div>
          <div>
            <p>
              Super Builtup Area sqft <sup>*</sup>
            </p>
            <input type="text" />
          </div>
          <div>
            <p>
              Carpet Area sqft <sup>*</sup>
            </p>
            <input type="text" />
          </div>
          <div>
            <p>Maintenance (Monthly)</p>
            <input type="text" />
          </div>
          <div>
            <p>Total Floors</p>
            <input type="text" />
          </div>
          <div>
            <p>Floor No</p>
            <input type="text" />
          </div>
          <div>
            <p>Car Parking</p>
            <div>
              <button>0</button>
              <button>1</button>
              <button>2</button>
              <button>3</button>
              <button>3+</button>
            </div>
          </div>
          <div>
            <p>Facing</p>
            <select name="facing" id="">
              <option value=""></option>
              <option value="east">East</option>
              <option value="north">North</option>
              <option value="north-east">North-East</option>
              <option value="north-west">North-West</option>
              <option value="south">South</option>
              <option value="south-east">South-East</option>
              <option value="south-west">South-West</option>
              <option value="west">West</option>
            </select>
          </div>
          <div>
            <p>Project Name</p>
            <input type="text" />
          </div>
          <div>
            <p>
              Ad Title <sup>*</sup>
            </p>
            <input type="text" />
            <div>
              <p>
                Mention the key features of your item (e.g. brand, model, age,
                type)
              </p>
              <p>0 / 70</p>
            </div>
          </div>
          <div>
            <p>Description *</p>
            <textarea name="description" id=""></textarea>
            <div>
              <p>Include condition, features and reason for selling</p>
              <p>0 / 4096</p>
            </div>
          </div>
          <hr />
          <div>
            <div>
              <h1>SET A PRICE</h1>
            </div>
            <p>
              Price <sup>*</sup>
            </p>
            <div>
              <LiaRupeeSignSolid />
              <input type="text" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
