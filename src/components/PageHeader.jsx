const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <img src="/nutriveda-logo.png" alt="NutriVeda" className="h-16 w-auto mb-4" />
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-600 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default PageHeader;
