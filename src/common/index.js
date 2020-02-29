export const getMaskCountClass = (count) => {
	if (count >= 50) {
		return "pharmacy-mask-more";
	}

	if (count <= 0) {
		return "pharmacy-mask-none";
	}

	return "pharmacy-mask-less";
};