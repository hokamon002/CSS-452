/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

const TOP_WING_LOCATION = 512;
const BOTTOM_WING_LOCATION = 348;
const WING_HEIGHT = 164;
const WING_WIDTH = 204;

function PatrolWing(aSpriteTexture, aStartingPosition, aWingType) {
    this.wingSprite = new SpriteAnimateRenderable(aSpriteTexture);
    this.wingSprite.getXform().setPosition(aStartingPosition[0], aStartingPosition[1]);
    this.setupSprite();
    this.wingType = aWingType === WING_TYPE_BOTTOM ? WING_TYPE_BOTTOM : WING_TYPE_TOP;
    this.interpolationX = new Interpolate(this.wingSprite.getXform().getXPos(), 120, 0.05);
    this.interpolationY = new Interpolate(this.wingSprite.getXform().getYPos(), 120, 0.05);
    this.setupAnimation();
    GameObject.call(this, this.wingSprite);
    this.wingBoundingBox = this.getBBox();
}

gEngine.Core.inheritPrototype(PatrolWing, GameObject);

PatrolWing.prototype.update = function () {
    this.wingBoundingBox = this.getBBox();
};

PatrolWing.prototype.setupSprite = function () {
    this.wingSprite.getXform().setSize(10, 8);
    var pixelOrigin = this.getPixelOrigin();
    this.wingSprite.setElementPixelPositions(0, WING_WIDTH, (pixelOrigin - WING_HEIGHT), pixelOrigin);
    var patrolColor = [1, 1, 1, 0];
    this.wingSprite.setColor(patrolColor);
};

PatrolWing.prototype.wingInterpolation = function (aHeadTransform) {
    var xInterpolationValue = aHeadTransform[0] + 10;
    var yInterpolationValue = this.wingType === WING_TYPE_BOTTOM ? aHeadTransform[1] - 6 : aHeadTransform[1] + 6;

    this.interpolationX.setFinalValue(xInterpolationValue);
    this.interpolationX.updateInterpolation();
    this.wingSprite.getXform().setXPos(this.interpolationX.getValue());
    this.interpolationY.setFinalValue(yInterpolationValue);
    this.interpolationY.updateInterpolation();
    this.wingSprite.getXform().setYPos(this.interpolationY.getValue());

    this.wingSprite.updateAnimation();
};

PatrolWing.prototype.setupAnimation = function () {
    var pixelOrigin = this.getPixelOrigin();
    this.wingSprite.setSpriteSequence(pixelOrigin, 0, WING_WIDTH, WING_HEIGHT, 5, 1);
    this.wingSprite.setAnimationSpeed(60);

};

PatrolWing.prototype.getPixelOrigin = function () {
    return this.wingType === WING_TYPE_BOTTOM ? BOTTOM_WING_LOCATION : TOP_WING_LOCATION;
};

PatrolWing.prototype.hit = function () {
    this.wingSprite.setColor([1, 1, 1, this.wingSprite.getColor()[3] + 0.2]);
};

