namespace Game{
	export class Setings{
		public speed : number;
		public asteroidSpeed : number;
		public asteroidMinSpawnTime : number;
		public asteroidMaxSpawnTime : number;
		public timeScore : number;


		constructor(speed : number, as : number, score:number, aMinTime : number, aMaxTime: number){
			this.speed = speed;
			this.asteroidSpeed = as;
			this.asteroidMinSpawnTime = aMinTime;
			this.asteroidMaxSpawnTime = aMaxTime; 
			this.timeScore = score;
		}
	}
}