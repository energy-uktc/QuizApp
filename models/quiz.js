export default class Quiz {
  constructor(
    id,
    title,
    imageUrl,
    description,
    timeLimit,
    date,
    minimumPointsPrc,
    ownerId
  ) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.date = date;
    this.timeLimit = timeLimit;
    this.minimumPointsPrc = minimumPointsPrc;
    this.ownerId = ownerId;
  }
}
